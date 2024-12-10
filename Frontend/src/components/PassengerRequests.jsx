import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';
import {Link} from "react-router-dom"

function PassengerRequests() {
  const {user}= useAuth0();
  const[requests , setRequests]= useState([])
  const [currentReq, setCurrentReq]= useState(null)


    const findPassengerRequests= async()=>{
      const {data}= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/fetchRequests/?email=${user.email}`);
      setRequests(data.requestedPassengers);
    }
    useEffect(()=>{
        findPassengerRequests();
    }, [user])
    const handleDecline=async()=>{
      const {data }= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/declinePassenger`,{
        currentReq
      });
      if(data.success){
          findPassengerRequests()
      }
    }
    const handleAccept=async()=>{
      // console.log(currentReq);
      const {data }= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/acceptPassenger`,{
        currentReq
      });
      if(data.success){
          findPassengerRequests()
      }
    }
    console.log(currentReq);
  return (
    <div className='w-full'>
      {/* bookingId , RiderId , RideId, DriverId , BookingStatus PaymentStatus , seatsRequired*/}
      {requests.length===0 && <div className='w-full h-screen  flex justify-center items-center font-bold text-2xl'>Sorry No Passenger Requests found 😥😥<Link to={"/create-ride"} className='font-semibold text-blue-500 underline'>Create a ride now </Link> </div>}
        {
          requests.length>0 && requests.map((request, i)=>{
            return<div key={i} className='w-full rounded-lg  bg-slate-200 mt-2 flex flex-col lg:flex-row px-4 gap-4'>
              <div className=' flex flex-col lg:flex-row w-full justify-around items-center'>
                <div className=' flex flex-row w-full  justify-around flex-1'>
                  <h1 className='font-semibold text-xl'>{request.ride.origin}</h1>
                    <p className='font-extrabold text-slate-500'>{"->"}</p>
                  <h1 className='font-semibold text-xl'>{request.ride.destination }</h1>
                </div>
                <div className='flex-1 flex justify-center items-center font-semibold gap-4 ml-4'>
                  <h1 className='font-semibold'>Date: {request.ride.departureTime.split('T')[0]} </h1>
                  <h1>Passenger name: {request.rider.fullName}</h1>
                </div>
                <div className=' mx-4 flex-1 flex justify-around  w-full  items-center'>
                  <p className='font-semibold text-lg'>₹{request.ride.price * request.seatsRequired}</p>
                  <p className='font-semibold text-lg '>Seats: {request.seatsRequired}</p>
                  <p className='font-semibold text-lg'>Payment: {request.paymentStatus}</p>
                </div>
              </div>
              <div className='flex flex-row justify-around items-center my-2 gap-4 mx-2'>
                <button className=' bg-rose-500  rounded-lg font-bold text-white px-10 py-2' onClick={()=>{
                  setCurrentReq(request);
                  handleDecline();
                }}>Decline </button>
                <button className='bg-green-500 rounded-lg font-bold text-white px-10 py-2' onClick={()=>{
                  setCurrentReq(request);
                  handleAccept();
                }}>Accept</button>
              </div>
            </div>
          })
        }
    </div>
  )
}

export default PassengerRequests