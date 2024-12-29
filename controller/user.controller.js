
import mailSender from '../utils/mailSender.utils.js';
// import { contactTemplate } from '../mail/template/Contact.template.js';
import { adminTemplate } from '../mail/template/Admin.template.js';
import contactModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { redisDb } from "../config/redisdb.js";
const redisClient=await redisDb();

export const createContact = async (req, res) => {
  try {
    const { name, image, phone, year } = req.body;
    let { postName, posts } = req.body;
    
    if (!name || !image || !phone || !year) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const eventDetails = await postModel.findById(posts);

    postName = eventDetails.name;
    if (!postName) {
      return res.status(403).json({
        message: "Post Name is not found"
      });
    }
    const newContact = new contactModel({ name, image, phone, year,postName });
   
    await newContact.save();
    const userUpdate=await contactModel.findByIdAndUpdate(newContact._id,
      { $push: { posts: eventDetails._id } }
    )
     const postUpdate=await postModel.findByIdAndUpdate(
      eventDetails._id,
          { $push: { users: newContact._id } }
        );
        console.log({"Event":postUpdate,"Users":userUpdate})
    // const sendMail=await mailSender(email,"Contact Saved Successfully",contactTemplate(name));
   const sendAdmin=await mailSender(process.env.MAIL_ADMIN,"One User has registered for an event",adminTemplate(newContact.name,newContact,phone,newContact.postName));
   console.log(sendAdmin)
   return res.status(200).json({message:"Contact Sent",data:userUpdate});
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error });
  }
};

export const showAllContacts=async(req,res)=>{
  try {
      const allContacts=await contactModel.find({});
      await redisClient.setEx("allUsers",43200,JSON.stringify(allContacts));
      return res.status(200).json({
          sucess:true,
          message:"Contacts: - ",
          allContacts
      });
  } catch (error) {
    return  res.status(400).json({
          sucess:false,
          message:"Internal error occured",
          error,
      });
  }
}
export const userDetails = async (req, res) => {
   try {
     const { id } = req.params;
      if (!id) 
        {
         return res.status(300).json({ success: false, message: "Slug not found", }); 
        } // Check if post is cached
    redisClient.get(`user:${id}`, async (err, user) => {
     if (user) 
    { 
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
return res.status(200).json({ success: true, 
message: "Post Found",
data: selectedUser,
});

 
} catch (error) {
   console.log(error); 
   return res.status(400).json({ success: false,
     message: "Internal error occurred",
     error });
}
}

