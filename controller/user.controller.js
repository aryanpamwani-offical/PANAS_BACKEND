import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import mailSender from '../utils/mailSender.utils.js';
import { adminTemplate } from '../mail/template/Admin.template.js';
import contactModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { redisDb } from "../config/redisdb.js";
import uploadOnCloudinary from '../utils/cloudinaryUpload.js';

const redisClient = await redisDb();

const processImage = async (filePath) => {
  try {
    const processedFilePath = path.join(
      path.dirname(filePath),
      `processed-${path.basename(filePath)}`
    );

    await sharp(filePath)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(processedFilePath);

    // Delete original file
    await fs.unlink(filePath);
    return processedFilePath;
  } catch (error) {
    // If processing fails, try to clean up the original file
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      console.error('Failed to delete original file:', unlinkError);
    }
    throw error;
  }
};

const cleanupFile = async (filePath) => {
  if (filePath) {
    try {
      await fs.access(filePath); // Check if file exists
      await fs.unlink(filePath);
    } catch (error) {
      // Ignore error if file doesn't exist
      if (error.code !== 'ENOENT') {
        console.error('Cleanup error:', error);
      }
    }
  }
};

export const createContact = async (req, res) => {
  let processedFilePath = null;
  
  try {
    const { name, phone, year } = req.body;
    let { postName, posts } = req.body;
    const displayPicture = req.file;

    if (!name || !phone || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [eventDetails, processedImage] = await Promise.all([
      postModel.findById(posts),
      displayPicture ? processImage(displayPicture.path) : null
    ]);

    if (!eventDetails) {
      if (processedImage) {
        await cleanupFile(processedImage);
      }
      return res.status(403).json({ message: "Post not found" });
    }

    processedFilePath = processedImage;
    const imageUpload = processedImage ? await uploadOnCloudinary(processedImage) : null;

    // Clean up the processed file after upload
    if (processedImage) {
      await cleanupFile(processedImage);
      processedFilePath = null; // Reset so we don't try to delete it again in finally block
    }

    if (displayPicture && !imageUpload) {
      return res.status(410).json({
        message: "Failed to upload Image"
      });
    }

    postName = eventDetails.name;

    const newContact = new contactModel({ 
      name, 
      imgUrl: imageUpload, 
      phone, 
      year, 
      postName 
    });

    await newContact.save();

    const [userUpdate, postUpdate] = await Promise.all([
      contactModel.findByIdAndUpdate(
        newContact._id, 
        { $push: { posts: eventDetails._id } }, 
        { new: true }
      ),
      postModel.findByIdAndUpdate(
        eventDetails._id, 
        { $push: { users: newContact._id } },
        { new: true }
      ),
      mailSender(
        process.env.MAIL_ADMIN,
        `Verify a ${newContact.name} User Registered for ${newContact.postName}`,
        adminTemplate(newContact.name, newContact.phone, newContact.postName, imageUpload, newContact._id)
      )
    ]);

    await redisClient.set(
      `contact:${newContact._id}`,
      JSON.stringify(userUpdate),
      'EX',
      3600
    );

    return res.status(200).json({
      message: "User Sent",
      data: postUpdate
    });

  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(400).json({ error: error.message });
  } finally {
    if (processedFilePath) {
      await cleanupFile(processedFilePath);
    }
  }
};
export const showAllContacts = async (req, res) => {
  try {
    const allContacts = await contactModel.find({});
    await redisClient.setEx("allUsers", 43200, JSON.stringify(allContacts));
    return res.status(200).json({
      sucess: true,
      message: "Contacts: - ",
      allContacts
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Internal error occured",
      error,
    });
  }
}
export const userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(300).json({ success: false, message: "Slug not found", });
    } // Check if post is cached
    redisClient.get(`user:${id}`, async (err, user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: "Post Found (from cache)",
          data: JSON.parse(user),
        }
        );
      }

    })
    const selectedUser = await contactModel.findById(id);
    if (!selectedUser) {
      return res.status(401).json({
        success: false,
        message: "Data not found",
      });
    }

    redisClient.setEx(`user:${id}`, 43200, JSON.stringify(selectedUser));
    return res.status(200).json({
      success: true,
      message: "Post Found",
      data: selectedUser,
    });


  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal error occurred",
      error
    });
  }
}
export const deleteUser=async(req,res)=>{
  try {
    const {_id}=req.params;
    const Delete= await postModel.findByIdAndDelete(_id);

        return res.status(200).json({
            sucess:true,
            data:postDelete,
            message:"Post Deleted Successfully",
        });
  } catch (error) {
    
  }
}


//File 
// Name minetype
// save diskstorage
// then cloud
// secure url
// image:secure url
// model