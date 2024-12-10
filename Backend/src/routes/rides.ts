import { Router } from "express";
const router = Router();
import { createRide, fetchRides,  fetchRequets, declinePassenger, acceptPassenger , fetchUpcomingRides, markCompleted} from "../controllers/rideController";

router.post("/create", createRide);
router.get("/fetch",fetchRides);
router.post("/declinePassenger", declinePassenger)
router.post("/acceptPassenger", acceptPassenger)
router.get("/fetchRequests/", fetchRequets)
router.get("/fetchUpcomingRides", fetchUpcomingRides)
router.post("/markCompleted", markCompleted)
export default router;