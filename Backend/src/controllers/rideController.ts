import { PrismaClient } from "@prisma/client";
import {Request , Response} from "express"
const prisma = new PrismaClient()
import { stripe } from "..";

export const createRide = async(req:Request, res:Response)=>{
    try{
        const {source, destination, departureTime, ETA, date, seatsRemaining, vehicle, fare}= req.body.values;
        // date = date.split("T")[0];
        // console.log(req.body);
        // console.log(`${date.split("T")[0]} ${departureTime}`);
        const {company,model} = vehicle.split('-');

        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
        });

        const vId = await prisma.vehicle.findFirst({
            where:{
                Company:company,
                model
            }
        });
        if(!user){
            throw new Error("User not found");
            
            // return res.status(404).json({
            //     msg:"User not found"
            // });
        }
        const rideCreation = await prisma.ride.create({
            data:{
                driver:{
                    connect:{
                        userId:user.userId
                    }
                },
                vehicle:{
                    connect:{
                        vehicleId:vId?.vehicleId
                    }
                },
                origin:source,
                price:parseFloat(fare),
                destination,
                departureTime:`${date.split("T")[0]}T${departureTime}:00Z`,
                EstimatedArrivalTime:`${date.split("T")[0]}T${ETA}:00Z`,
                seatsRemaining

            }
        })

        return res.status(200).json({
            message:"Ride created successfully"
        })
        
    }
    catch(e:any){
        console.log("error");
        console.error(e);
        res.status(500).json({
            message:e
        })
    }
}


export const fetchRides =async (req:Request, res:Response)=>{
    try{
        const {SC, DC , date , seats }= req.query;
        if (!date || !SC || !DC || !seats){
            return res.status(200).json({
                success:false, 
                error :"Please provide all the trip details",
            })
        }
        const rides = await prisma.ride.findMany({
            where: {
                origin: {contains: SC ? SC.toString(): undefined },
                destination: {contains: DC ? DC.toString() : undefined },
            }
        });
        const filteredRides = rides.filter(ride => {
            // Compare entire date string with departureTime
            const tofilterDate= new Date(date.toString());
            return (
                tofilterDate.toISOString().split('T')[0]===ride.departureTime.toISOString().split('T')[0]
                &&
                seats<= ride.seatsRemaining.toString()
            );
        });
        return res.status(200).json({
            success:true, 
            mesaage:"Rides fetched Successfully", 
            rides:filteredRides,
        })
    }
    catch(e:any){
          return res.status(500).json({
            success:false, 
            message :"Error in finding rides", 
            error : e.mesaage
          })
    }
}


export const fetchRequets=async (req:Request, res:Response)=>{
    try{
        const {email}= req.query;
        const user = await prisma.user.findFirst({
            where:{
                email:email as string,
            }
        })
        // console.log(user);
        const passengerRequests = await prisma.booking.findMany({
            where:{
                driverId:user?.userId
            },
            select:{
                paymentStatus:true, 
                bookingStatus:true, 
                ride:{
                    select:{
                        origin:true, 
                        destination:true, 
                        departureTime:true, 
                        EstimatedArrivalTime:true, 
                        seatsRemaining:true,
                        price:true, 
                        rideId:true

                    }
                }, 
                seatsRequired:true,
                rider:true, 
                bookingId:true
            }
        })
        const filteredPassengers = passengerRequests.filter(passengerRequest => passengerRequest.bookingStatus === 'pending' && passengerRequest.ride?.seatsRemaining||0>=passengerRequest.seatsRequired);
        return res.status(200).json({
            success:true, 
            requestedPassengers: filteredPassengers
        })
    }
    catch(e:any){
        return res.status(500).json({
            success:"false", 
            error: e.message
        })
    }
}

export const declinePassenger=async(req:Request, res:Response)=>{
    try{
        const{currentReq}= req.body;
        // console.log(currentReq);
        const data = await prisma.booking.update({
            where:{
                bookingId:currentReq.bookingId,
            }, 
            data:{
                bookingStatus:"declined",
            }
        });
        if (data.paymentStatus==="Online"){
            // init refund ;
        }else{
            return res.status(200).json(
                {
                    success:true,
                }
            )
        }
    }
    catch(e){
        return res.status(500).json({
            success:false,
        })
    }
}

export const acceptPassenger = async (req: Request, res: Response) => {
    try {
      const { currentReq } = req.body;
  
      if (!currentReq || !currentReq.bookingId || !currentReq.ride || !currentReq.rider) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request payload',
        });
      }
  
    //   console.log(currentReq);
  
      // Update the booking status
      const updatedBooking = await prisma.booking.update({
        where: {
          bookingId: currentReq.bookingId,
        },
        data: {
          bookingStatus: 'accepted', // Set a meaningful status
        },
      });
  
      // Update the ride with the new passenger
      const updatedRide = await prisma.ride.update({
        where: {
          rideId: currentReq.ride.rideId,
        },
        data: {
          Passengers: {
            connect: {
              userId: currentReq.rider.userId,
            },
          },
          seatsRemaining:{
            decrement:Number(currentReq.seatsRequired)
          }
        },
      });
  
      res.status(200).json({
        success: true,
        data: {
          updatedBooking,
          updatedRide,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        message: 'An error occurred while accepting the passenger',
      });
    }
  };



  
export const fetchUpcomingRides=async (req:Request, res:Response)=>{
    try{
        const {email}= req.query;
        const user = await prisma.user.findFirst({
            where:{
                email:email as string,
            }
        })
        // console.log(user);
        const passengerRequests = await prisma.booking.findMany({
            where:{
                OR:[
                    {driverId:user?.userId,}, 
                    {
                        riderId:user?.userId
                    }
                ]
            },
            select:{
                paymentStatus:true, 
                bookingStatus:true, 
                ride:{
                    select:{
                        origin:true, 
                        destination:true, 
                        departureTime:true, 
                        EstimatedArrivalTime:true, 
                        seatsRemaining:true,
                        price:true, 
                        rideId:true,
                        completed:true

                    }
                }, 
                seatsRequired:true,
                rider:true, 
                bookingId:true

            }
        })
        // console.log(passengerRequests);
        const filteredPassengers = passengerRequests.filter(passengerRequest => passengerRequest.bookingStatus === 'accepted' && passengerRequest.ride?.completed===false);
        return res.status(200).json({
            success:true, 
            AcceptedPassengers: filteredPassengers
        })
    }
    catch(e:any){
        return res.status(500).json({
            success:"false", 
            error: e.message
        })
    }
}

export const markCompleted=async(req:Request, res:Response)=>{
    try{
        const {curr}= req.body;
        const data = await prisma.ride.update({
            where:{
                rideId:curr.ride.rideId
            },
            data:{
                completed:true,
            }
        })
        return res.status(200)
    }
    catch(e){

    }
}
