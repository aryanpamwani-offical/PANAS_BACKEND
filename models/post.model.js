import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  content: {
    type: String,
  },
  keyword: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category' // Correctly reference the Category model
  },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Correctly reference the Category model
  },
  categoryName: {
    type: String, // Changed to String
  },
  shortDesc: {
    type: String, // Changed to String
  },
  slug: {
    type: String, // Changed to String
  },
  Date: {
    type: Date,
  },
});

export default mongoose.model("Post", postSchema);
