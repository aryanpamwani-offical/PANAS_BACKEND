
import categoryModel from "../models/category.model.js";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";



export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name ) {
            return res.status(400).json({
                sucess: false,
                message: "Name is required "
            })
        }
        const postCreate= await postModel.create({
            name:"",
            content:"",
            category:"",
            categoryName:"",
            imgUrl:"",
            Date:new Date(Date.now()),
            keyword:""
          
        });
        const userCreate= await userModel.create({
          name:"",
          phone:"",
          category:"",
          categoryName:"",
          year:"",
          image:""
        
      });
        const categoryDetails = await categoryModel.create({ name: name,posts:postCreate._id,users:userCreate._id });
        const postUpdate=await postModel.findByIdAndUpdate(
            { _id:postCreate._id},
            {$set:{
                category:categoryDetails._id,
                categoryName:categoryDetails.name
              
                
            }},{new:true}
        ); 
        const userUpdate=await userModel.findByIdAndUpdate(
          { _id:userCreate._id},
          {$set:{
              category:categoryDetails._id,
              categoryName:categoryDetails.name
            
              
          }},{new:true}
      ); 
        if (!categoryDetails || !postUpdate || !userUpdate) {
            return res.status(303).json({
                message:"Failed to Create category"
            })
        }
        console.log("Category",categoryDetails,"Post",postUpdate,"User",userUpdate );
        return res.status(200).json({
            sucess: true,
            message: "Category Created Successfully",

        });
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            sucess: false,
            message: "Internal error occured",
        });
    }
}
export const showAllCategories = async (req, res) => {
    try {
        const allCategories = await categoryModel.find({}, { name: true,posts:true });
        if (!allCategories) {
            return res.status(303).json({
                message:"Failed to show all category"
            })
        }
        return res.status(200).json({
            sucess: true,
            message: "Category: - ",
            allCategories
        });
    } catch (error) {
        return res.status(400).json({
            sucess: false,
            message: "Internal error occured",
        });
    }
}

export const categoryPageDetails = async (req, res) => {
    try {
        const _id = req.params._id;
        if ( !_id) {
            return res.status(400).json({
                sucess:false,
                message:"All fields are required "
            })
        }
        const selectedCategory = await categoryModel.findById(_id);
       
        
        if (!selectedCategory) {
            return res.status(401).json({
                sucess: false,
                message: "Data not found",
            });
        }
 

        return res.status(200).json({
            sucess: true,
            data: {
                selectedCategory,
             
            }
        });

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({
            sucess: false,
            message: "Internal error occured",
        });
    }
}

export const updateCategory=async(req,res)=>{
    try {
        const {_id}=req.params;
        if (!_id) {
            return  res.status(300).json({
                sucess:false,
                message:"ID not found",
            });
        } 
        const {name}=req.body;
        if (!name) {
            return res.status(400).json({
                sucess:false,
                message:"All fields are required "
            })
        }
        const category=await categoryModel.findById(_id)
        const categoryUpdate=await categoryModel.findByIdAndUpdate(
            { _id:category._id},
            {$set:{
                name:name,   
            }},
            {new:true}
        );
        
     
        console.log(name)

       
        return res.status(200).json({
            sucess:true,
            data:name,
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



export const deleteCategory = async (req, res) => {
    try {
      const { _id } = req.params;
      const { newCategoryId } = req.body;
  
      if (!_id || !newCategoryId) {
        return res.status(400).json({
          success: false,
          message: "Category ID and new category ID are required",
        });
      }
  
      const category = await categoryModel.findById(_id);
  
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
  
      const newCategory = await categoryModel.findById(newCategoryId);
  
      if (!newCategory) {
        return res.status(404).json({
          success: false,
          message: "New category not found",
        });
      }
  
      // Check if category.posts is an array and handle accordingly
      let posts = [];
      if (Array.isArray(category.posts) && category.posts.length > 0) {
        posts = await postModel.find({
          _id: { $in: category.posts }
        });
      } else {
        posts = await postModel.find({ category: category._id });
      }
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No posts found for this category",
        });
      }
  
      for (let post of posts) {
        await postModel.findByIdAndUpdate(post._id, {
          $set: {
            category: newCategory._id.toString(),
            categoryName: newCategory.name
          }
        });
  
        if (!newCategory.posts.includes(post._id)) {
          await categoryModel.findByIdAndUpdate(newCategory._id, {
            $addToSet: { posts: post._id }
          });
        }
      }
  
      await newCategory.save();
      const deletedCategory = await categoryModel.findByIdAndDelete(category._id);
  
      return res.status(200).json({
        success: true,
        data: deletedCategory,
        message: "Category and associated posts updated successfully"
      });
    } catch (error) {
      console.log("Error in deleteCategory:", error);
      return res.status(500).json({
        success: false,
        message: "Internal error occurred",
        error,
      });
    }
  };
  