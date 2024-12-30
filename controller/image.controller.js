// import imageModel from "../models/image.model.js";
// import { uploadToCloudinary } from "../utils/imageUploader.utils.js";
// import { v2 as cloudinary } from 'cloudinary';

// export const imageUploadController = async (req, res) => {
//   try {
//     const displayPicture = req.file; 
//     console.log(displayPicture)
//     if (!displayPicture) {
//       return res.status(401).json({
//         message: "Please Share Image",
//       });
//     }

//    // const cloudinaryImage = await cloudinary.uploader.upload(req.file.path);

//     // if (!cloudinaryImage) {
//     //   return res.status(401).json({
//     //     message: "Image Failed To Upload",
//     //   });
//     // }

//     // const saveImage = await imageModel.create({ image: cloudinaryImage.secure_url });

//     // if (!saveImage) {
//     //   return res.status(403).json({
//     //     message: "Image Failed To Save",
//     //   });
//     // }

//     return res.status(200).json({
//       success: true,
//       message: `Image Uploaded Successfully`,
//       // data: saveImage,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
//   };
  