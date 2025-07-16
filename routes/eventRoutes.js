import express from "express"
import { createNewEvent,
        getEventDetails,
        registerForEvent,
        cancelRegistration,
        upcomingEvents,
        eventStats
 } from "../controllers/eventControllers.js";

const router = express.Router()

router.post("/create", createNewEvent)
router.get("/details/:id", getEventDetails)
router.post("/register",registerForEvent)
router.delete("/cancel",cancelRegistration)
router.get("/upcoming",upcomingEvents)
router.get("/stats",eventStats)




export default router;