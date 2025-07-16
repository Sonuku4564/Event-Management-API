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


export const getEventDetails = async(req,res)=>{
try {
    // parsing the id parameter to integer  
    const eventId = parseInt(req.params.id)

    // finding the events details from db
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registration: {
          include: {
            user: true, // Includes Registered user details
          },
        },
      },
    });

    if(!event){
        return res.status(400).json({message: "Event does not exist"});  
    }

    // Mapping the user objects from event registrations
    const registerUsers = event.registration.map(r => r.user)

    // sendign response to the users
    res.status(200).json({
        ...event,
        registerUsers
    })
} catch (error) {
    console.log("Error in getEventDetails Controller", error.message);
    res.status(500).json({ message: " Internal Server Error", }); 
}
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


export const cancelRegistration = async(req,res)=>{
    try {
        const {userId, eventId} = req.body;
        
        // Checking if the user is registered for the event
        const registerUser = await prisma.registration.findUnique({
        where: {
            userId_eventId: { userId, eventId },
        }
        });

        if (!registerUser) {
        return res.status(400).json({ message: "User already registered" });
        }

        // deleting the user registration from db
        await prisma.registration.delete({
            where: {
                userId_eventId: { userId, eventId },
            },
        });
    
        // sending response to the user
        return res.status(200).json({ message: "Registration Cancelled Successfully" });

    } catch (error) {
        console.log("Error in cancelRegistration Controller", error.message);
        res.status(500).json({ message: " Internal Server Error", }); 
    }
}


export const upcomingEvents = async(req,res)=>{
    try {

      // fetching list of all future events from db 
      const upcomingEvent = await prisma.event.findMany({
        where:{
            dateTime:{
                gt: new Date(),
            },
        },
        orderBy:[
            // sorting events in ascending order as per date
            { dateTime: 'asc' },  
            // sorting events in ascending order as per location
            { location: 'asc' },
        ],
      })

       // sending response to the user
      return res.status(200).json(upcomingEvent);
    } catch (error) {
      console.log("Error in upcomingEvents Controller", error.message);
      res.status(500).json({ message: " Internal Server Error", });   
    }
}


export const eventStats = async(req,res)=>{
    try {
        // parse the eventId as integer
       const eventId = parseInt(req.params.id);

        // fetching the events from db with registrations
       const fetchEvents = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                registration: true,
            },
        });

        // checking if the event exist in db
        if(!fetchEvents){
            res.status(400).json({ message: "Event does not exist", });   
        }

        // calculating stats like totalRegistrations , remainingCapacity,  percentageCapacity
        const totalRegistrations = fetchEvents.registration.length
        const remainingCapacity = fetchEvents.capacity - totalRegistrations
        const percentageCapacity =  ((totalRegistrations / fetchEvents.capacity) * 100).toFixed(1);

        // sending response to the user
        return res.status(200).json({
            eventId: fetchEvents.id,
            title: fetchEvents.title,
            totalRegistrations,
            remainingCapacity,
            percentageCapacity: `${percentageCapacity}%`,
    });


    } catch (error) {
      console.log("Error in eventStats Controller", error.message);
      res.status(500).json({ message: " Internal Server Error", });   
    }
}