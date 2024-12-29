
import express from 'express';
import { categoryPageDetails, createCategory, deleteCategory, showAllCategories, updateCategory } from "../controller/category.controller.js";


const router=express.Router();
router.post('/create',createCategory);
router.get('/showall',showAllCategories);
router.get('/showsingle/:_id',categoryPageDetails);
router.put('/update/:_id',updateCategory);
router.delete('/delete/:_id',deleteCategory);
export default router