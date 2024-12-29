

export const adminTemplate = ( name,email,subject,detail) => {
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

        
    </style>

</head>

<body>
    <div class="container">
       
        <div class="message">User Contacted Us</div>
        <div class="body">
            <p>Name: ${name},</p>
            <br>
            <p>Email: ${email},</p>
            <br>
            <p>Subject: ${subject},</p>
             <br>
            <p>Detail: ${detail},</p>
             <br>
        
</body>

</html>
`
}
