import { Router } from "express";
const router = Router();
import { signUp, getCars, setCars } from "../controllers/userController";
router.post("/signin", signUp);
router.get("/getCars", getCars);
router.post("/setCars", setCars);

export default  router;