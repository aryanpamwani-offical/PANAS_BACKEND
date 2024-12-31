import mailSender from '../utils/mailSender.utils.js';
// import { contactTemplate } from '../mail/template/Contact.template.js';
import { adminTemplate } from '../mail/template/Admin.template.js';
import contactModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { redisDb } from "../config/redisdb.js";
import { generatePublicUrl, uploadFile } from '../utils/imageUploader.utils.js';
import { checkFilesInDirectory } from '../utils/fileCheck.js';
import path from "path";

const redisClient = await redisDb();

export const createContact = async (req, res) => {
  try {
    const { name, phone, year } = req.body;
    let { postName, posts } = req.body;

    const displayPicture = req.file;
    if (!displayPicture) {
      return res.status(401).json({ message: "Please Share Image" });
    }

    // Ensure that the filePath variable is defined 
    const filePath = displayPicture.path;
    // console.log(`File path: ${filePath}`); 

    // Ensure that the mimeType variable is defined 
    const mimeType = displayPicture.mimetype;
    // console.log(`MIME type: ${mimeType}`); 

    // Upload the file
    const imageUpload = await uploadFile(displayPicture.originalname, mimeType, filePath);
    // console.log(`Upload file function: ${uploadFile}`); 
    if (!imageUpload) {
      return res.status(410).json({
        message: "Failed to upload Image"
      })
    }

    // Define the directory path 
    const directoryPath = path.dirname(filePath);
    // console.log(`Directory path: ${directoryPath}`); 

    // Check if the uploaded file exists in the directory 
    checkFilesInDirectory(directoryPath, displayPicture.filename);
    // console.log(`Check files in directory function: ${checkFilesInDirectory}`);
    const genereateImageUrl = await generatePublicUrl(imageUpload.id);
    // console.log(genereateImageUrl)
    const { webViewLink } = genereateImageUrl;
   
    
    if (!name || !phone || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const eventDetails = await postModel.findById(posts);
    postName = eventDetails.name;
    if (!postName) {
      return res.status(403).json({ message: "Post Name is not found" });
    } const newContact = new contactModel({ name, imgUrl: webViewLink, phone, year, postName });
    await newContact.save();
    const userUpdate = await contactModel.findByIdAndUpdate(
      newContact._id, { $push: { posts: eventDetails._id } }, { new: true })
    const postUpdate = await postModel.findByIdAndUpdate(
      eventDetails._id, { $push: { users: newContact._id } });
      console.log(`Name: ${newContact.name}`); 
      console.log(`Phone: ${newContact.phone}`); 
      console.log(`Post Name: ${newContact.postName}`);
      const sendAdmin = await mailSender( process.env.MAIL_ADMIN,
         `Verify a ${newContact.name} User Registered for ${newContact.postName} Dance`,
        adminTemplate(newContact.name, newContact.phone, newContact.postName, newContact.imgUrl) );

    return res.status(200).json({
      message: "User Sent",
      data: userUpdate
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
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