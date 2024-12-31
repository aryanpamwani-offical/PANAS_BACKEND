
import categoryModel from "../models/category.model.js";





export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name ) {
            return res.status(400).json({
                sucess: false,
                message: "Name is required "
            })
        }
      
   
    
        const categoryDetails = await categoryModel.create({ name: name,posts:[]});
        console.log("Category",categoryDetails);
        
        if (!categoryDetails) {
            return res.status(303).json({
                message:"Failed to Create category"
            })
        }

        
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
      console.log(_id);
  
      if (!_id) {
        return res.status(400).json({
          success: false,
          message: "Category ID are  required",
        });
      }
  
    //   const category = await categoryModel.findById(_id);
  
    //   if (!category) {
    //     return res.status(404).json({
    //       success: false,
    //       message: "Category not found",
    //     });
    //   }
  
  
      const deletedCategory = await categoryModel.findByIdAndDelete(_id);
  
      return res.status(200).json({
        success: true,
        data: deletedCategory,
        message: "Category and associated posts deleted successfully"
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
  