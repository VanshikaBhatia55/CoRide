import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
import { stripe } from "..";

export const publishableKey = (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    PublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

export const checkout = async (req: Request, res: Response) => {
  try {
    const { rideDetails } = req.body;
    // console.log(req.body);
    const user = await prisma.user.findFirst({
      where: {
        email: rideDetails.useremail,
      },
    });
    const ride = await prisma.ride.findFirst({
      where: {
        rideId: rideDetails.rideId,
      },
    });
    // console.log(ride);
    // console.log(req.body);
    if (!req.body.paymentMode) {
      const Response = await prisma.booking.create({
        data: {
          bookingStatus: "pending",
          paymentStatus: "Cash",
          rideId: Number(ride?.rideId),
          riderId: Number(user?.userId),
          seatsRequired: Number(rideDetails.seatsRequired),
          driverId: Number(rideDetails.driverId),
        },
      });
      // console.log(rideDetails);
      return res.status(200).json({
        success: "true ",
        data: "Ride request added successfully",
        mode: "Cash",
      });
    } else {
      // console.log(req.body);
      await prisma.booking.create({
        data:{
          bookingStatus:"unconfirmed", 
          paymentStatus:"Online", 
          rideId:Number(ride?.rideId),
          riderId:Number(user?.userId),
          seatsRequired:Number(rideDetails.seatsRequired),
          driverId:Number(rideDetails.driverId)
        }
      })
      const session= await stripe.checkout.sessions.create({
        line_items:[
          {
            price_data:{
              currency:"inr", 
              product_data:{
                name:`${rideDetails.origin}-${rideDetails.destination}`,
                description:"Ride Booking",
                
              }, 
              unit_amount:rideDetails.amount*100,

            },
            quantity:1,
          }
        ],
        billing_address_collection:"required",
        customer_email:rideDetails.useremail,
        mode:'payment',
        // @ts-ignore
        success_url:"http://localhost:8000/api/v1/payments/paymentSuccess/?session_id={CHECKOUT_SESSION_ID}&ride_id={}",
        cancel_url:"http://localhost:8000/ap1/v1/payments/cancelPayment"
      })
      // console.log(session);
      return res.status(200).json({
        success:true, 
        url:session.url,
        orderId:session.client_reference_id
      })
    }
  } catch (e: any) {
    console.log(e.message);
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};

export const paymentSuccess=async(req:Request, res:Response)=>{
  // @ts-ignore
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  // @ts-ignore
  const email= session.customer_email;
  const user= await prisma.user.findFirst({
    where:{
      email:email||""
    }
  });
  // console.log(user);
  const currentBooking = await prisma.booking.updateMany({
    where:{
        riderId:Number(user?.userId),
        paymentStatus:"Online",
        bookingStatus:"unconfirmed",
    },
    data:{
      bookingStatus:"pending", 
      stripe_ref_id:session.id
    }
  })
  return res.redirect("http://localhost:5173/myRides");
}
export const cancle= async(req:Request, res:Response)=>{
  console.log(req.body);
  return res.status(200).json({
    sucess:false,
  })
}