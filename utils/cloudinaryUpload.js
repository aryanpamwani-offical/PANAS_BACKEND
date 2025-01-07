import fs from "fs/promises";  // Using promise-based fs
import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Upload to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // Get the URL
        const url = response.secure_url;
        
        // Delete the local file regardless of the upload result
        try {
            await fs.unlink(localFilePath);
            console.log(`File deleted successfully: ${localFilePath}`);
        } catch (unlinkError) {
            console.error(`Failed to delete file: ${localFilePath}`, unlinkError);
        }

        // Return the URL if upload was successful
        return url || null;

    } catch (error) {
        // If upload fails, delete the file and log the error
        try {
            await fs.unlink(localFilePath);
            console.log(`File deleted successfully: ${localFilePath}`);
        } catch (unlinkError) {
            console.error(`Failed to delete file: ${localFilePath}`, unlinkError);
        }
        
        console.error("Error during upload:", error);
        return null;
    }
};

export default uploadOnCloudinary;