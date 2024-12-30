import express from 'express';
import { createContact, showAllContacts, userDetails } from "../controller/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
const router=express.Router();
router.post('/create',upload.single("image"),createContact);
router.get('/showall',showAllContacts);
router.get('/showsingle/:id',userDetails);
export default router