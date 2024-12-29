import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
       
    },
    posts:[{
            type: mongoose.Schema.Types.ObjectId ,
            ref: "Post",
           
        }],
},

);

export default mongoose.model("Category",categorySchema);