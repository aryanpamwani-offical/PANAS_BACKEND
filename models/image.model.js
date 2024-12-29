import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
       
    },
   
   
},

);

export default mongoose.model("Image",imageSchema);