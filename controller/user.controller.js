

import contactModel from '../models/user.model.js';
import postModel from '../models/post.model.js';
import { redisDb } from "../config/redisdb.js";


const redisClient = await redisDb();



 

export const createContact = async (req, res) => {
  
  
  try {
    const { name, phone, year,amount,type } = req.body;
    let { postName, posts } = req.body;
    

    if (!name || !phone || !year || !amount || !type ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [eventDetails] = await Promise.all([
      postModel.findById(posts),
     
    ]);

  
    postName = eventDetails.name;

    const newContact = new contactModel({ 
      name, 
      amount,
      phone, 
      year,
      type, 
      postName 
    });

    await newContact.save();

    


    await redisClient.set(
      `contact:${newContact._id}`,
      JSON.stringify(newContact),
      'EX',
      3600
    );

    return res.status(200).json({
      message: "User Sent",
      data: newContact
    });

  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(400).json({ error: error.message });
  } 
};
export const showAllContacts = async (req, res) => {
  try {
    const allContacts = await contactModel.find({});
    await redisClient.setEx("allUsers", 43200, JSON.stringify(allContacts));
    return res.status(200).json({
      sucess: true,
      message: "Contacts: - ",
      allContacts
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Internal error occured",
      error,
    });
  }
}
export const userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(300).json({ success: false, message: "Slug not found", });
    } // Check if post is cached
    redisClient.get(`user:${id}`, async (err, user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: "Post Found (from cache)",
          data: JSON.parse(user),
        }
        );
      }

    })
    const selectedUser = await contactModel.findById(id);
    if (!selectedUser) {
      return res.status(401).json({
        success: false,
        message: "Data not found",
      });
    }

    redisClient.setEx(`user:${id}`, 43200, JSON.stringify(selectedUser));
    return res.status(200).json({
      success: true,
      message: "Post Found",
      data: selectedUser,
    });


  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal error occurred",
      error
    });
  }
}
export const deleteUser=async(req,res)=>{
  try {
    const {_id}=req.params;
    const Delete= await postModel.findByIdAndDelete(_id);

        return res.status(200).json({
            sucess:true,
            data:postDelete,
            message:"Post Deleted Successfully",
        });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal error occurred",
      error
    });
  }
}


export const userUpDate=async(req,res)=>{
  try {
    const { id } = req.params;
  const {type,amount}=req.body;
  if (!type || !amount) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!id) {
    return res.status(300).json({ success: false, message: "Slug not found", });
  } 
  const selectedUser = await contactModel.findById(id);
  if (!selectedUser) {
    return res.status(401).json({
      success: false,
      message: "Data not found",
    });
  }
  const userUpdate= await contactModel.findByIdAndUpdate(selectedUser._id,{
    $set:{
        type:type,
        amount:amount,
    }
  },{new:true},);
  return res.status(200).json({
    sucess:true,
    data:userUpdate,
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

// Utility functions for search
const processSearchTerm = (searchTerm) => {
  if (!searchTerm) return '';
  const cleaned = searchTerm.trim();
  const words = cleaned.split(/\s+/);
  return words.length === 1 ? cleaned : words;
};

const buildSearchCriteria = (searchTerm) => {
  if (!searchTerm) return {};

  const processedTerm = processSearchTerm(searchTerm);
  
  if (Array.isArray(processedTerm)) {
      const wordQueries = processedTerm.map(word => ({
          $or: [
              { name: { $regex: word, $options: 'i' } },
              { postName: { $regex: word, $options: 'i' } },
              { type: { $regex: word, $options: 'i' } }
          ]
      }));

      const exactPhraseQuery = {
          $or: [
              { name: { $regex: searchTerm, $options: 'i' } },
              { postName: { $regex: searchTerm, $options: 'i' } },
              { type: { $regex: searchTerm, $options: 'i' } }
          ]
      };

      return {
          $or: [
              { $and: wordQueries },
              exactPhraseQuery
          ]
      };
  }

  return {
      $or: [
          { name: { $regex: processedTerm, $options: 'i' } },
          { postName: { $regex: processedTerm, $options: 'i' } },
          { type: { $regex: processedTerm, $options: 'i' } }
      ]
  };
};

// Generate cache key for consistency
const generateCacheKey = (searchTerm, page, limit) => {
  return `search:${searchTerm || 'all'}:page${page}:limit${limit}`;
};

// Main search function
export const searchUser = async (req, res) => {
  try {
      const redisClient = await redisDb();
      const { searchTerm } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 30;
      
      // Try to get cached results
      const cacheKey = generateCacheKey(searchTerm, page, limit);
      const cachedResults = await redisClient.get(cacheKey);
      
      if (cachedResults) {
          return res.json(JSON.parse(cachedResults));
      }
      
      // Build search criteria
      const searchCriteria = buildSearchCriteria(searchTerm);
      const skip = (page - 1) * limit;
      
      // Execute search and count in parallel
      const [users, total] = await Promise.all([
          contactModel.find(searchCriteria)
              .select('name phone year postName amount type createdAt')
              .skip(skip)
              .limit(limit)
              .lean(),
          contactModel.countDocuments(searchCriteria)
      ]);
      
      const result = {
          success: true,
          data: users,
          pagination: {
              currentPage: page,
              totalPages: Math.ceil(total / limit),
              totalResults: total,
              resultsPerPage: limit
          }
      };
      
      // Cache the results with 5 minutes TTL
      await redisClient.setEx(cacheKey, 300, JSON.stringify(result));
      
      res.json(result);
      
  } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
          success: false,
          message: 'Error performing search',
          error: error.message
      });
  }
};

// Create indexes for better performance
export const createSearchIndexes = async () => {
  try {
      // Create compound indexes for the searchable fields
      await contactModel.collection.createIndex({
          name: 1,
          postName: 1,
          type: 1
      });
      
      // Create index for pagination
      await contactModel.collection.createIndex({
          createdAt: -1,
          _id: -1
      });
      
      console.log('Indexes created successfully');
  } catch (error) {
      console.error('Error creating indexes:', error);
  }
};