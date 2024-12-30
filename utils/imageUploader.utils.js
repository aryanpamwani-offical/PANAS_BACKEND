import { drive } from "../config/googleDrive.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to upload file
export const uploadFile = async (filename, mimeType, filePath) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: filename, // This can be the name of your choice
                mimeType: mimeType,
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath),
            },
        });

        // This response data contains id, use that id
        console.log('File uploaded successfully:', response.data);
        fs.unlink(filePath, (err) => { if (err) {
           console.error(`Failed to delete file: ${filePath}`, err);
           } else { 
          console.log(`File deleted successfully: ${filePath}`);
         } });
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
};


export const  generatePublicUrl=async(id)=> {
    try {
      const fileId = id;
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  

      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      return result.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  