// /* eslint-disable react/prop-types */
import Calender from './Calender';
import { InlineIcon } from '@iconify/react';
import { CitySearch,PassengerCount } from './TripInputs';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { publishSourceAtom,publishDestAtom,startTimeAtom,etaAtom,seatsAtom,vehicleAtom,priceAtom,publishDateAtom, } from '../atoms/publishRideAtoms';
export default function CreateRideComponent(){
    const{ isAuthenticated,loginWithPopup,user } = useAuth0();
    const navigate = useNavigate()
    const source = useRecoilValue(publishSourceAtom)
    const destination = useRecoilValue(publishDestAtom)
    const departureTime = useRecoilValue(startTimeAtom)
    const ETA = useRecoilValue(etaAtom)
    const date = useRecoilValue(publishDateAtom)
    const seatsRemaining = useRecoilValue(seatsAtom)
    const vehicle = useRecoilValue(vehicleAtom)
    const fare = useRecoilValue(priceAtom)
    
    const formPublishHandler = async (e)=>{
        
        e.preventDefault();
        try {
            const values = {
                source,
                destination,
                departureTime,
                ETA,
                date,
                seatsRemaining,
                vehicle,
                fare
            }
            console.log(`${import.meta.env.VITE_BACKEND_URL}/rides/create`,{values,email:user.email});
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/rides/create`,{values,email:user.email});
            
            console.log(res.data);
            navigate('/myRides');
        } catch (error) {
            console.error(error);
        }

        
    }
    const publishRideHandler = async(e)=>{
        if(!isAuthenticated){
            await loginWithPopup();
        }
    }
    return(
        <form className="rounded-lg bg-white shadow-md" onSubmit={(e)=>formPublishHandler(e)}>

                <PublishRideInputs/>

            <div>
                <button className='bg-green-500 w-full py-3 px-4 rounded-b-lg text-xl hover:bg-green-600 font-semibold' type='submit' onClick={(e)=>publishRideHandler(e)}>Publish ride</button>
            </div>
        </form>
    )

}

function TimePicker({title,atomName,minVal}){
    const atomGetter = useRecoilValue(atomName);
	const atomSetter = useSetRecoilState(atomName);

    return(
        <div className='grow my-2'>
            <label htmlFor={title.split(" ")[0]} className='text-slate-600'>{title}</label>
                <div>
                    <div className="w- relative flex">
                        
                        <input type="time" value={atomGetter} onChange={(e)=>{atomSetter(e.target.value)}} id={title.split(" ")[0]} className="w-full text-lg hover:bg-slate-100 mt-2 p-1 border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0" required { ...(minVal ? { min: minVal } : {}) } />
                        {/* {minVal ? (
                            <input type="time" value={atomGetter} onChange={(e)=>{atomSetter(e.target.value)}} id={title.split(" ")[0]} min={minVal} className="w-full text-lg hover:bg-slate-100 mt-2 p-1 border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0" required />
                        ):
                            (<input type="time" value={atomGetter} onChange={(e)=>{atomSetter(e.target.value)}} id={title.split(" ")[0]} className="w-full text-lg hover:bg-slate-100 mt-2 p-1 border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0" required />)
                        } */}
                    </div>
                </div>
        </div>
    )
}

function PublishRideInputs(){
    const atomGetter = useRecoilValue(startTimeAtom)
    return(
        <div className='flex flex-col p-4 px-2 mx-2 divide-y divide-slate-700 '>
            <CitySearch placeholder={"Leaving from"} atomName={publishSourceAtom} />

            <CitySearch placeholder={"Going to"} atomName={publishDestAtom} />

            <div className='flex gap-4 px-3'>
                <TimePicker title={"Departure time"} atomName={startTimeAtom} />
                <TimePicker title={"Arrival time"} atomName={etaAtom} minVal={atomGetter}/>
            </div>

            <div>
                <Calender atomName={publishDateAtom} />
            </div>
            
            <div>
                <PassengerCount title={"seat available"} atomName={seatsAtom} />
            </div>
            <div>
                <VehicleOptions/>
            </div>
            <div className='relative py-2'>
                <RidePrice />
            </div>
        </div>
    )
}
function RidePrice({}){
    const atomGetter = useRecoilValue(priceAtom);
	const atomSetter = useSetRecoilState(priceAtom);

    return(
        <div className='relative'>
                    <div className='absolute left-0 flex h-full justify-center items-center pl-2 text-lg'>
                        <label htmlFor="fare">
                            <InlineIcon icon={"fluent:currency-dollar-rupee-24-regular"} >{' '}</InlineIcon>
                        </label>
                    </div>
                    <input type="number" name="fare" id="fare" className='pl-[28px] py-2 p-1 w-full text-md hover:bg-slate-100 font-semibold border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0' min="0" max="10000" value={atomGetter} onChange={(e)=>atomSetter(e.target.value)} required/>
                </div>
    )
}
function VehicleOptions(){
    const [cars,setCars] = useState([]);
    const {user} = useAuth0();
    const atomGetter = useRecoilValue(vehicleAtom);
	const atomSetter = useSetRecoilState(vehicleAtom);
    useEffect(()=>{
        if(user){
            (async ()=>{
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/getCars?email=${user.email}`)
                .catch(e=>{
                    console.error(e);
                });
                // console.log("res",res.data);
                setCars(res.data.cars);
                // console.log("cars",cars);
            })();
        }
    },[user]);

    return(
        <div className='flex gap-4 px-3 my-2 items-end'>
            <div className='grow'>
                <label htmlFor="hs-hidden-select" className="text-slate-600 ">Select a car</label>
                <select id="hs-hidden-select" onChange={(e)=>atomSetter(e.target.value)} required className="rounded-md hover:bg-slate-100 py-2 block w-full mt-2">
                    {!cars.length? <option value="" disabled>You don't have any cars added</option> :cars.map((e)=>{
                        return(
                            <option value={`${e.Company}-${e.model}`} key={e.vehicleId}>{e.Company} {e.model}</option>
                        )
                    })}
                </select>

            </div>
            <div>
                <Link to="/profile"><button type='button' className='py-2 mt-2 bg-blue-400 border-green-700 border-2 rounded-md px-1 hover:bg-blue-600' >Add Car</button></Link>
            </div>
        </div>
    )
}       