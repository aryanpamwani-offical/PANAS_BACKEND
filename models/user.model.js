import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        
    },
    year: {
        type: String,
        required: true,
    },
   
    image: {
        type: String,
        required: true,
       
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post' // Correctly reference the Category model
      },
    postName: {
        type: String, // Changed to String
      },
    
},
{timestamps:true},
);

export default mongoose.model("User",contactSchema);