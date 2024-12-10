import React, { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios';

function UpcomingRides() {
  const {user}= useAuth0();
  const[upcomingRides, setUpcomingRides]= useState([])
    const findPassengerRequests= async()=>{
      const {data}= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/fetchUpcomingRides/?email=${user.email}`);
      if(data.AcceptedPassengers){
        setUpcomingRides(data.AcceptedPassengers);
      }
    }
    useEffect(()=>{
        findPassengerRequests();
    }, [user])
    console.log(upcomingRides);
  return (
    <div>
      {
        upcomingRides.length===0?<div className='w-full h-screen flex justify-center items-center font-bold text-xl'>You don't have any upcoming rides scheduled </div>:
        <div>
          {
            upcomingRides.map((ride, i)=><div key={i}>
                <div className='w-full bg-slate-200 flex  flex-col lg:flex-row justify-between items-center px-10 py-2 my-2'>
                  <h1 className='flex-1 w-full text-center font-bold'>{ride.ride.origin}</h1>
                  <h1 className=' flex-1 w-full text-center font-bold'>{ride.ride.destination}</h1>
                  <h1 className='flex-1 w-full text-center font-bold'>{ride.ride.departureTime.split('T')[0]}</h1>
                  {
                    user.email != ride.rider.email&&<button className=' flex-1 w-full  py-2 my-4 rounded-lg text-white bg-green-400 font-bold'
                    onClick={()=>{
                      const curr= ride;
                      async function markcompleted(){
                          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/markCompleted`, {
                            curr
                          })
                          await findPassengerRequests();
                      }
                      
                      markcompleted();
                    }}
                    >Mark as Completed</button>
                  }
                </div>
            </div>)
          }
        </div>
      }
    </div>
  )
}

export default UpcomingRides