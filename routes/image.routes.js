import express from 'express';
// import { imageUploadController } from '../controller/image.controller.js';
import { upload } from '../middleware/multer.middleware.js';

const router=express.Router();

// router.post('/upload',upload.single("image") ,imageUploadController);

export default router