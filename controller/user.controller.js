
import mailSender from '../utils/mailSender.utils.js';
import { adminTemplate } from '../mail/template/Admin.template.js';
import contactModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { redisDb } from "../config/redisdb.js";


const redisClient = await redisDb();



 

export const createContact = async (req, res) => {
  
  
  try {
    const { name, phone, year,amount,type } = req.body;
    let { postName, posts } = req.body;
    

    if (!name || !phone || !year || !amount || !type ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [eventDetails] = await Promise.all([
      postModel.findById(posts),
     
    ]);

  
    postName = eventDetails.name;

    const newContact = new contactModel({ 
      name, 
      amount,
      phone, 
      year,
      type, 
      postName 
    });

    await newContact.save();

    


    await redisClient.set(
      `contact:${newContact._id}`,
      JSON.stringify(newContact),
      'EX',
      3600
    );

    return res.status(200).json({
      message: "User Sent",
      data: newContact
    });

  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(400).json({ error: error.message });
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
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal error occurred",
      error
    });
  }
}


