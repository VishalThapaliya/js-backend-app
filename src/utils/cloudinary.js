import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return;
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
    
        // when file is uploaded successfully
        console.log("File has been uploaded to Cloudinary.", response.url);

        return response;
    } catch (error) {
        // remove file from local storage in case of error
        fs.unlinkSync(localFilePath);
        console.error("Error while uploading file to Cloudinary.", error);
        return null;
    }
}