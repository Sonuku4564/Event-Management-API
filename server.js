import express from "express";
import "dotenv/config";

// importing route
import eventRoutes from "./routes/eventRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

// json parsing middleware
app.use(express.json());

// route
app.use("/api/events", eventRoutes)
app.use("/api/user", userRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})