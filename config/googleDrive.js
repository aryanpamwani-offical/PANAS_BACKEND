const { google } = require("googleapis");
const path = require('path');
const fs = require('fs');


const oauth2Client=new google.auth.OAuth2(
    process.env.GOOGLE_DRIVE_CLIENT_ID,
    process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    process.env.GOOGLE_DRIVE_REDIRECT_URI
)
oauth2Client.setCredentials({refresh_token:process.env.GOOGLE_DRIVE_REFERSH_TOKEN})
const drive=google.drive({
    version:"v2",
    auth:oauth2Client

})

const filePath = path.join(__dirname, 'example.jpg');

const uploadFile=async()=>{
try {
    const response = await drive.files.create({
        requestBody: {
          name: 'example.jpg', //This can be name of your choice
          mimeType: "image/jpeg",
        },
        media: {
          mimeType: "image/jpeg",
          body: fs.createReadStream(filePath),
        },
      });
//   This response data contains id use that id
      console.log(response.data);
} catch (error) {
    console.log(error.message);
}
}
uploadFile();

// const deleteFile=async()=> {
//     try {
//       const response = await drive.files.delete({
//         fileId: 'YOUR FILE ID',
//       });
//       console.log(response.data, response.status);
//     } catch (error) {
//       console.log(error.message);
//     }
//   }
  
//   deleteFile();
  
 const  generatePublicUrl=async()=> {
    try {
      const fileId = 'YOUR FILE ID';
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }