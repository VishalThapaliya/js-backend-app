import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
    const coverImageLocalPath = req.files?.coverImage[0].path;

    if(!avatarLocalPath) {
        throw new Error(400, "Avatar file is required");ßß
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
        throw new ApiError(200, "Server error while registering user");
    }

    // return response
    return res.status(201).json(
        new ApiResponse(200, registerUser, "User registered successfully!!!")
    )
});