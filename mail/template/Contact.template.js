
export const contactTemplate = ( name) => {
    return `
    
    <!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Contact Information Saved Successfully</title>
    <style>
        body {
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.4;
            color: #333333;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 20px;
        }

        .message {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .body {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .support {
            font-size: 14px;
            color: #999999;
            margin-top: 20px;
        }

        .highlight {
            font-weight: bold;
      
            }
    </style>

</head>

<body>
    <div class="container">
        <a href="https://aryanpamwani.me/"><img class="logo" src="https://res.cloudinary.com/dttek3gqg/image/upload/v1727273929/navlogo_a1hivv_yqlgb3.png" alt="Aryan Pamwani Logo"></a>
        <div class="message">Contact Information Saved Successfully</div>
        <div class="body">
            <p> ${name},</p>
            <p>Your contact information has been successfully saved. Thank you for keeping your details up to date.</p>
            <p>If you have any questions or require further assistance, please do not hesitate to reach out to us.We will contact you as soon as possible</p>
        </div>
        <div class="support">For inquiries, please contact us at <a href="mailto:admin@aryanpamwani.me">admin@aryanpamwani.me</a>. We are here to assist you.</div>
    </div>
</body>

</html>
`
}