import { createClient } from 'redis';
import dotenv  from 'dotenv';
dotenv.config();
export const redisDb=async()=>{
    const redisClient = await createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    }).on("error",(err)=>console.log(err))
    .on("connect",()=>console.log("Redis Connected Successfully"))
    .connect();
    return redisClient;

}


