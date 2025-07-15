import express from "express";
import "dotenv/config";

// importing routes
import eventRoutes from "./routes/eventRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/events", eventRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})