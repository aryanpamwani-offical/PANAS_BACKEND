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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category' // Correctly reference the Category model
      },
    categoryName: {
        type: String, // Changed to String
      },
    
},
{timestamps:true},
);

export default mongoose.model("User",contactSchema);