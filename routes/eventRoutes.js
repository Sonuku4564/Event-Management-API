import express from "express"
import { createNewEvent,
        getEventDetails,
        registerForEvent,
        cancelRegistration,
        upcomingEvents,
        eventStats
 } from "../controllers/eventControllers";

const router = express.Router()

router.post("/create", createNewEvent)
router.get("/details", getEventDetails)
router.post("/register/:id",registerForEvent)
router.delete("/cancel/:id",cancelRegistration)
router.get("/upcoming",upcomingEvents)
router.get("/stats",eventStats)


export default router;