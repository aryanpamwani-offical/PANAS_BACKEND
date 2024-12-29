import mongoose from 'mongoose';

const scheduledPostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  imgUrl: { type: String, required: true },
  shortDesc: { type: String, required: true },
  keyword: { type: String, required: true },
  slug: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
});

const ScheduledPost = mongoose.model('ScheduledPost', scheduledPostSchema);
export default ScheduledPost;
