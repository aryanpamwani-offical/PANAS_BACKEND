import { v2 as cloudinary } from 'cloudinary';

 export const uploadToCloudinary=async(file,folder,height,quantity)=>{
 try {
  
  cloudinary.resouce_type="auto";
  return await  cloudinary.uploader.upload(file.tempFilePath);
  
 } catch (error) {
 console.log(error)
 }
 }