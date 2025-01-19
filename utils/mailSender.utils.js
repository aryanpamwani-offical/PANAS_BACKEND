
import nodemailer from "nodemailer";
const mailSender=async(email,title,body)=>{
    try {
        let transporter=nodemailer.createTransport({
            service:"gmail",
            secure:true,
            port:process.env.MAIL_PORT,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        }
    );
    let info=await transporter.sendMail({
        from:`${process.env.MAIL_USER}`,
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`,
    })
    return info;
    } catch (error) {
        console.log("Internal Server Error",error.message);
    }
};

export default mailSender;