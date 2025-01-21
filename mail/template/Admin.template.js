export const adminTemplate = (name, phone, postName,id) => {
    return( `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify a New User</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-white font-sans text-gray-700">
    <div class="container mx-auto max-w-lg p-6 mt-10 border border-gray-300 rounded-lg shadow-lg">
        <div class="text-center mb-6">
            <p class="text-xl font-semibold">Respected Admin,</p>
            <p class="text-lg">A new user, <span class="text-blue-500 font-bold">${name}</span>, has registered for ${postName}.</p>
            <p class="text-lg">Please visit the dashboard to verify the user and generate their payment receipt.</p>
        </div>
        <div class="flex justify-center">
            <a href="${process.env.ADMIN_URL}/${id}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">Go to Dashboard</a>
        </div>
        <div class="mt-6">
            <p class="text-lg">You can also contact the user at ${phone} (for reference only).</p>
            <p class="text-lg mt-4">Here is the user's uploaded image:</p>
            
        </div>
        <div class="mt-6 text-center">
            <p class="text-lg">Thanks & Regards,</p>
            <p class="text-lg font-semibold">CyberTeam</p>
        </div>
    </div>
</body>
</html>

`);
};
