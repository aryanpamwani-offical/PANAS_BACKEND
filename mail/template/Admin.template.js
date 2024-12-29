

export const adminTemplate = ( name,phone,postName) => {
    return `
    
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Verify a New User</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css" />
</head>

<body class="bg-white font-sans text-gray-700">
    <div class="container mx-auto max-w-md p-6 text-center">
        <h1 class="text-2xl font-bold mb-4">Verify a New User Registered for HipHop Dance</h1>
        <p class="text-lg">Respected Admin,</p>
        <p class="text-lg">A new user, <span class="text-blue-500 font-bold">${name}</span> , has registered for ${postName}.</p>
        <p class="text-lg">Please visit the dashboard to verify the user and generate their payment receipt.</p>
        <a href="/dashboard" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Go to Dashboard</a>
        <p class="text-lg mt-4">You can also contact the user at ${phone} (for reference only).</p>
        <p class="text-lg">Thanks & Regards,</p>
        <p class="text-lg">CyberTeam</p>
    </div>
</body>

</html>
`
}
