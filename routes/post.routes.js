import express from "express";

import { createPost, deletePost, postPageDetails, searchPosts, showAllPost,  updatePost,schedulePost, showAllSchedulePost } from "../controller/post.controller.js";

const router=express.Router();

router.post('/create',createPost);
router.post('/schedule',schedulePost)
router.get('/schedule/showall',showAllSchedulePost);
router.get('/showall',showAllPost);
router.get('/showsingle/:slug',postPageDetails);
router.get('/', searchPosts);
router.put('/update/:_id',updatePost);

router.delete('/delete/:_id',deletePost);
export default router
