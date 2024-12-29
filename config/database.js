import {connect} from "mongoose";
import dotenv from "dotenv"
dotenv.config();

 const connectDb=async()=>{
  
       await connect(process.env.MONGOURL).then(()=>{
            console.log("Mongoose Connected Sucessfully");
    }).catch((error)=>{
        console.log("Mongoose Failed To Connect",error.message)
        process.exit();
    })  
};
export default connectDb