import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // store refresh token in db
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong white generating refresh and access token");
    }
}

export const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    const { fullName, email, username, password } = req.body;

    // validation - not empty
    if([fullName, email, username, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if(existedUser) {
        throw new ApiError(409, "User with same email or username already exists");
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    
    if(!avatarLocalPath) {
        throw new Error(400, "Avatar file is required");
    }

    //upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    // remove password and refresh token field from response
    const registeredUser = await User.findById(user._id).select("-password -refreshToken");

    // check for user creation
    if(!registerUser) {
        throw new ApiError(500, "Server error while registering user");
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, registeredUser, "User registered successfully!!!")
    )
});

export const loginUser = asyncHandler( async (req, res) => {
    // get data from req.body
    const { email, username, password } = req.body();

    // check if username or email exists
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    // find the user
    const registeredUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if(!registeredUser) {
        throw new ApiError(404, "User does not exists")
    }
    
    // password check
    const isPasswordValid = await registeredUser.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // access and refresh token
    const { accessToken, refreshToken} = generateAccessAndRefreshTokens(registeredUser._id);
    
    const loggedInUser = await User.findById(registeredUser._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    // send cookie 
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    );

});

export const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully!!!"))
});