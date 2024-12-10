import { Router } from "express";
import { checkout, publishableKey , paymentSuccess, cancle} from "../controllers/paymentController";
const router = Router();
router.get("/pubKey",publishableKey )
router.post("/checkout", checkout);
router.get("/paymentSuccess", paymentSuccess);
router.get("/cancelPayment",cancle)
export default router;