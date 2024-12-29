import categoryModel from "../models/category.model.js";
import postModel from "../models/post.model.js";
import ScheduledPost from '../models/schedule.model.js';
import schedule from 'node-schedule';
import axios from 'axios';
import { redisDb } from "../config/redisdb.js";
const redisClient=await redisDb();


export const createPost = async (req, res) => {
  try {
    const { name, content, category, imgUrl, shortDesc, keyword } = req.body;
    let { categoryName, slug } = req.body;

    if (!name || !content || !category || !imgUrl || !shortDesc || !keyword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Generate slug
    slug = name.toString().toLowerCase().trim().replace(/[^a-z\s-]/g, '').replace(/\s+/g, '-');

    console.log(slug);

    const categoryDetails = await categoryModel.findById(category);
    categoryName = categoryDetails.name;
    if (!categoryName) {
      return res.status(403).json({
        message: "Category Name is not found"
      });
    }
    const postCreate = await postModel.create({
      name,
      content,
      category,
      imgUrl,
      categoryName,
      Date: new Date(Date.now()),
      shortDesc,
      slug,
      keyword
    });
    await categoryModel.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { posts: postCreate._id } }
    );
   
    return res.status(200).json({
      success: true,
      data: postCreate,
      message: "Post Created Successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal error occurred",
      error,
    });
  }
};



export const schedulePost = async (req, res) => {
  const { name, content, category, imgUrl, shortDesc, keyword, date } = req.body;
  let { slug } = req.body;

  if (!name || !content || !category || !imgUrl || !shortDesc || !keyword || !date) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // Generate slug
  slug = name.toString().toLowerCase().trim().replace(/[^a-z\s-]/g, '').replace(/\s+/g, '-');
  console.log(slug);

  // Parse the date
  const scheduledDate = new Date(date);

  // Store the post data in the database
  const post = new ScheduledPost({ name, content, category, imgUrl, shortDesc, keyword, slug, scheduledDate });
  await post.save();

  // Schedule the task
  schedule.scheduleJob(scheduledDate, async () => {
    try {
      await axios.post(`${process.env.BASE_URL}/post/create`, post); // Adjust the API URL as needed
      await ScheduledPost.findByIdAndDelete(post._id); // Remove from database after posting
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  });

  return res.status(200).json({
    success: true,
    message: "Post scheduled successfully"
  });
};

export const showAllPost=async(req,res)=>{
    try {
    
    await redisClient.get("allPost",(post)=>{
        if (post) {
          return res.status(200).json({
            sucess:true,
            message:"POST: - ",
          post
        });
        
      }
      return;
    })
    const allCategories=await postModel.find({});
    await redisClient.setEx("allPost",43200,JSON.stringify(allCategories));
    
      return res.status(200).json({
          sucess:true,
          message:"POST: - ",
          allCategories
      });
       
    } catch (error) {
      return  res.status(400).json({
            sucess:false,
            message:"Internal error occured",
            error,
        });
    }
}

export const showAllSchedulePost=async(req,res)=>{
  try {
      const allCategories=await ScheduledPost.find({});
      return res.status(200).json({
          sucess:true,
          message:"POST: - ",
          allCategories
      });
  } catch (error) {
    return  res.status(400).json({
          sucess:false,
          message:"Internal error occured",
          error,
      });
  }
}

export const postPageDetails = async (req, res) => {
   try {
     const { slug } = req.params;
      if (!slug) 
        {
         return res.status(300).json({ success: false, message: "Slug not found", }); 
        } // Check if post is cached
    redisClient.get(`post:${slug}`, async (err, post) => {
     if (post) 
    { 
      return res.status(200).json({ 
        success: true,
        message: "Post Found (from cache)",
         data: JSON.parse(post),
         }
        );
     }
       
 })
 const selectedPost = await postModel.findOne({ slug }).exec(); 
 if (!selectedPost) { 
  return res.status(401).json({
     success: false,
      message: "Data not found",
     });
 }

redisClient.setEx(`post:${slug}`, 43200, JSON.stringify(selectedPost)); 
return res.status(200).json({ success: true, 
message: "Post Found",
data: selectedPost,
});

 
} catch (error) {
   console.log(error); 
   return res.status(400).json({ success: false,
     message: "Internal error occurred",
     error });
}
}

export const updatePost=async(req,res)=>{
    try {
        const {_id}=req.params;
        if (!_id) {
            return  res.status(300).json({
                sucess:false,
                message:"ID not found",
            });
        } 
        const {name,content,imgUrl,shortDesc,keyword}=req.body;
        if (!name || !content || !_id || !imgUrl || !shortDesc || !keyword) {
            return res.status(400).json({
                sucess:false,
                message:"All fields are required "
            })
        }
        
        const post=await postModel.findById(_id);
       let slug;
        slug = name.toString().toLowerCase().trimEnd().replace(/\s+/g, '-');
       
        const postUpdate=await postModel.findByIdAndUpdate(
            { _id:post._id},
            {$set:{
                name:name,
                content:content,
                imgUrl:imgUrl,
                shortDesc:shortDesc,
                slug:slug,
                Date:new Date(Date.now()),
                keyword:keyword
                
            },},
           
            {new:true}
        );
        
     


       
        return res.status(200).json({
            sucess:true,
            data:postUpdate,
            message:"Post Updated Successfully",
        });
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            sucess:false,
            message:"Internal error occured",
            error,


        });
    }
}

export const deletePost=async(req,res)=>{
    try {
        const {_id}=req.params
       
        if ( !_id) {
            return res.status(400).json({
                sucess:false,
                message:"All fields are required "
            })
        }
        const post=await postModel.findById(_id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        console.log(post.category);
        

     
  const categoryPostRemove=await categoryModel.findByIdAndUpdate(post.category,{
    $pull:{
        posts:post._id
    }
  } ,{ new: true })

     
     const postDelete= await postModel.findByIdAndDelete(_id);

        return res.status(200).json({
            sucess:true,
            data:postDelete,
            message:"Post Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            sucess:false,
            message:"Internal error occured",
            error,
        });
    }
}

export const searchPosts = async (req, res) => {
  try {
    const searchQuery = req.query.search; // Accessing query parameter
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const posts = await postModel.find({ name: { $regex: searchQuery, $options: 'i' } }).find({
        _id:{$ne:req._id}
        
        
    }); ;
   

    return res.status(200).json({ success: true, data: posts })
  } catch (error) {
    console.error('Error searching for posts:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

