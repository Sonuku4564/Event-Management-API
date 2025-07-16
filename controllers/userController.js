import prisma from "../utils/db.js"

export const createUser = async(req,res)=>{
try {
    
    const {name, email} = req.body
    
    // Validating whether name and email is present
    if(!name || !email){
        return res.status(400).json({ message: "name or email missing" });
    }

    // checking for email format
    if(!email.includes('@')){
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Checking for existing user using email
    const existingUser = await prisma.user.findUnique({
            where: {
                email: email, 
            },
        });

    if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" }); 
    }

    // Creating a new user in database
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
        },
    });

    // sending response to the user
    return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });
  
} catch (error) {
    console.log("Error in createUser Controller", error.message);
    res.status(500).json({ message: " Internal Server Error", });   
}
  
}