import express from 'express';
import  connectDb  from './config/database.js';
import dotenv  from 'dotenv';
import cors from "cors";
import postRoutes from './routes/post.routes.js'
import categoryRoutes from './routes/category.routes.js'
import contactRoutes from './routes/user.routes.js'
import imageRoutes from './routes/image.routes.js'
import {errorHandler, notFound } from './middleware/errorMiddleware.js';
import reloadWebsite from './config/upTimeServer.js';
import { cloudinaryConnect } from './config/cloudinary.js';
import { redisDb } from './config/redisdb.js';

 
dotenv.config();

const PORT = process.env.PORT || 4000;

const app=express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   
app.use(cors());

const interval = process.env.INTERVAL||20000;


connectDb();
const redisDataBase=await redisDb();
reloadWebsite();
setInterval(reloadWebsite, interval);
cloudinaryConnect();

//routes
app.use("/api/post", postRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", contactRoutes);
app.use("/api/image", imageRoutes);

//def route

app.get("/", (req, res) => {
	return res.status(200).json({
		success:true,
		message:'Your server is up and running....'
	});
});


app.listen(PORT,(req,res)=>{
    console.log(`Server running at http://localhost:${process.env.PORT}/`)
})