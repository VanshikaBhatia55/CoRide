import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response) => {
  // console.log("hello");
  try {
    // console.log(req.body);
    // return res.send("hello");
    const {nickname, name, picture, email}= req.body;
    // // Check if the user already exist
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      // If the user doesn't exist, create them
      await prisma.user.create({
        data: {
          email: email,
          fullName:nickname, 
          userName:name+Math.random()*6,
          profile_picture:picture,
        },
      });
      return res.status(200).json({
        success: true,
        message: "User Created",
      });
    } else {
      // If the user already exists, return a message indicating that
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "User and DB sync error",
      error: e.message,
    });
  }
};


export const getCars = async (req: Request, res:Response) => {

  try{
    const email: string | undefined = req.query.email as string | undefined;

    // console.log(req.body);
    // await prisma.user.findFirst()
    const user = await prisma.user.findFirst({
      where:{
        email
      },
      select:{
        userId:true
      }
    })
    console.log(user);
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    } else{
      const cars = await prisma.vehicle.findMany({
        where:{
          vehicleOwnerUserId:user.userId
        }
      });
      if(!cars){
        return res.status(404).json({
          success: false,
          message: "No cars not found"
        })
      } else{
        return res.status(200).json({
          success: true,
          cars
        });
      }
    }
  } catch(e:any){
    res.status(500).json({
      success: false,
      message: "User and DB sync error",
      error: e.message,
    })
  }
}

export const setCars = async (req:Request, res:Response) => {
  try {
    const {email} = req.body.user;
    const{company,model,type,purchaseYear,capacity} = req.body.values;

    const u = await prisma.user.findFirst({
      where:{
        email
      },
      select:{
        userId:true
      }
    });
    // console.log("-------------------------------------",{
    //   Company:company,
    //   model,
    //   vehicleType:type,
    //   purchaseYear:+purchaseYear,
    //   capacity: +capacity,}
    // )

    if(!u){
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    
    const newVehicle = await prisma.vehicle.create({
      data:{
        Company:company,
        model,
        vehicleType:type,
        purchaseYear:+purchaseYear,
        capacity: +capacity,
        vehicleOwner:{
          connect: {
            userId:u.userId
          }
        }
      }
    });
    return res.status(200).json({
      message:"Vehicle added successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: error
    })
    // console.log("uesr not found");
  }
}