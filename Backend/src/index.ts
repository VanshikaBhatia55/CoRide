import express, {Errback} from "express";
import { config } from "dotenv";
import Stripe from "stripe"
import cors from "cors"
import authRoutes from "./routes/authRoute"
import rideRoutes from "./routes/rides"
import paymentRoutes from "./routes/payments"
const app = express();
config();
app.use(express.json());
app.use(cors());
  
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rides", rideRoutes);
app.use("/api/v1/payments",paymentRoutes);
app.listen(process.env.PORT || 3000).on("error", (e: Errback) => {
    console.log("Error in listening to port", e);
});