import express from "express";

import { createPost, deletePost, postPageDetails, searchPosts, showAllPost,  updatePost,} from "../controller/post.controller.js";

const router=express.Router();

router.post('/create',createPost);
router.get('/showall',showAllPost);
router.get('/showsingle/:_id',postPageDetails);
router.get('/', searchPosts);
router.put('/update/:_id',updatePost);

router.delete('/delete/:_id',deletePost);
export default router
