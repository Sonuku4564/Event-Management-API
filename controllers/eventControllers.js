import prisma from "../utils/db.js"

export const createNewEvent = async(req,res)=>{
    try {
       const {title, dateTime, location, capacity} = req.body
       
       //applying sever side validations
       if(!title || !dateTime || !location || !capacity){
        return res.status(400).json({message: "All fields are required"});  
       }

       // validating capacity 
        if(typeof capacity == "string" ){
         return res.status(400).json({message: "Capacity must be an integer"});  
       }

       if(typeof capacity !== "number" || capacity < 1 || capacity > 1000){
         return res.status(400).json({message: "Please input capacity between 1 to 1000"});  
       }

       // creating event in prisma db
        const event = await prisma.event.create({
        data: {
            title,
            dateTime: new Date(dateTime),
            location,
            capacity
        }
        });

        // sending success response with event id
        return res.status(200).json({ eventId: event.id }); 

    } catch (error) {
        console.log("Error in createNewEvent Controller", error.message);
        res.status(500).json({ message: " Internal Server Error", });   
    }
}


export const getEventDetails = (req,res)=>{

}


export const registerForEvent = async(req,res)=>{
    try {
        const {userId, eventId} = req.body;

        // Checking if the event exist 
        const existingEvent = prisma.event.findUnique({
            where: { id: eventId },
            include: { registration: true },
        })

        if(!existingEvent){
            return res.status(400).json({message: "Event does'nt exist"});  
       }

       // Checking for the past event
       if (new Date(existingEvent.date) < new Date()){
            return res.status(400).json({message: "Cannot Register to past events"});
       }

       // checking for the maximum capacity 
       if (existingEvent.registration.length >= existingEvent.capacity){
            return res.status(400).json({message: "Event Maximum Capacity reached"});
       }

       // Checking for duplicate registration
        const existingUser = await prisma.registration.findUnique({
        where: {
            userId_eventId: { userId, eventId },
        }
        });

        if (existingUser) {
        return res.status(400).json({ message: "User already registered" });
        }


       // creating registration
       const registrations = await prisma.registration.create({
            data: {
                user: { connect: { id: userId } },
                event: { connect: { id: eventId } },
            },
        });

        return res.status(200).json(registrations); 

    }

    catch (error) {
        console.log("Error in registerForEvent Controller", error.message);
        res.status(500).json({ message: " Internal Server Error", }); 
    }
}


export const cancelRegistration = (req,res)=>{
    
}


export const upcomingEvents = (req,res)=>{
    
}


export const eventStats = (req,res)=>{
    
}