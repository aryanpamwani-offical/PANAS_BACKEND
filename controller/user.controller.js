
import mailSender from '../utils/mailSender.utils.js';
// import { contactTemplate } from '../mail/template/Contact.template.js';
import { adminTemplate } from '../mail/template/Admin.template.js';
import contactModel from '../models/user.model.js';
import categoryModel from '../models/category.model.js';

export const createContact = async (req, res) => {
  try {
    const { name, image, phone, year,category } = req.body;
    let { categoryName,  } = req.body;
    
    if (!name || !image || !phone || !year) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const categoryDetails = await categoryModel.findById(category);
    categoryName = categoryDetails.name;
    if (!categoryName) {
      return res.status(403).json({
        message: "Category Name is not found"
      });
    }
    const newContact = new contactModel({ name, image, phone, year,category,categoryName });
    await newContact.save();
    // const sendMail=await mailSender(email,"Contact Saved Successfully",contactTemplate(name));
   const sendAdmin=await mailSender(process.env.MAIL_ADMIN,"One User has registered for an event",adminTemplate(name,email,subject,detail));
   return res.status(200).json({message:"Contact Sent",data:newContact});
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const showAllContacts=async(req,res)=>{
  try {
      const allContacts=await contactModel.find({});
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