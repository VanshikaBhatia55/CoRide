import { InlineIcon } from '@iconify/react';
import { useMemo, useEffect, useCallback } from 'react';
import Calender from './Calender';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { searchSourceAtom, searchDestAtom, searchDateAtom, searchSeatsAtom } from '../atoms/searchRideAtoms';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TripInputs(){
	const navigate = useNavigate();
	const sourceCity = useRecoilValue(searchSourceAtom)
	const destinationCity = useRecoilValue(searchDestAtom)
	const date = useRecoilValue(searchDateAtom)
	const seats= useRecoilValue(searchSeatsAtom)
	const handlefindRides=()=>{
		if (sourceCity.length>0 && destinationCity.length>0){
			navigate("/all-rides")
		}
	}
    return(
        <div className='relative px-10'>
			<div className='bg-white rounded-lg'>
				<InputFields />
				<button className='bg-green-500 w-full py-3 px-4 rounded-b-lg text-xl hover:bg-green-600' onClick={handlefindRides}>Search</button>
			</div>
        </div>

    )
}
function InputFields(){
    return(
        <div className='flex flex-col p-4 px-2 mx-2 max-lg:divide-y max-lg:divide-slate-700 lg:flex-row lg:divide-x-2 lg:divide-slate-500'>
            <CitySearch placeholder={"Leaving from"} atomName={searchSourceAtom} />
            <CitySearch placeholder={"Going to"} atomName={searchDestAtom} />
			<Calender atomName={searchDateAtom} />
			<PassengerCount title={"passenger"} atomName={searchSeatsAtom} />
        </div>
    )

}
export function CitySearch({placeholder,atomName}){
	const atomGetter = useRecoilValue(atomName);
	const atomSetter = useSetRecoilState(atomName);
    return(
        <div className='relative grow'>
            <div className='border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0 py-2 lg:mx-2'>
                <div className='absolute left-0 top-0 bottom-0 p-2'>
                    <div className='flex justify-center flex-col h-full lg:pl-2'>
                        <InlineIcon icon={"fluent:circle-32-regular"} >{' '}</InlineIcon>
                    </div>
                </div>
                <input type="text" value={atomGetter} onChange={(e)=>atomSetter(e.target.value)} name={placeholder.split(" ")[0]} id="" required placeholder={placeholder} className='pl-[28px] py-2 hover:bg-slate-100 w-full border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0' />
            </div>
        </div>
    )
}
export function PassengerCount({title,atomName}){
	const atomGetter = useRecoilValue(atomName);
	const atomSetter = useSetRecoilState(atomName);

	const passenger = useMemo(()=>{
		if (atomGetter == 1) {
			return title;
		}else{
			const text = title.split(" ");
			const ans = text[0]+"s ";
			text.shift();
			return ans+(text.join(" "));
		}
	},[atomGetter,title])

	const increaseCheckCount = () =>{
		if(atomGetter == 6) return;
		atomSetter(()=>atomGetter+1);
	}
	const decreaseCheckCount = () =>{
		if(atomGetter==1) return;
		atomSetter(()=>atomGetter-1);

	}

	return(
		<div className=' py-2 grow'>
			<div className='flex justify-between bg-white px-2 py-1 hover:bg-slate-100 rounded-lg lg:mx-2'>
				<div className='flex gap-3 items-center'>
					<div className='text-3xl'>
						<InlineIcon icon={"fluent:person-28-regular"}>{' '}</InlineIcon>
					</div>
					<span className=''>{atomGetter} {passenger}</span>
				</div>
				<div className='flex gap-4 text-2xl'>
					<button type='button' onClick={decreaseCheckCount} className='rounded-lg hover:bg-slate-200'>
						<InlineIcon icon={"fluent:subtract-28-filled"}>{' '}</InlineIcon>
					</button>
					<button type='button' onClick={increaseCheckCount} className=' rounded-lg hover:bg-slate-200'>
						<InlineIcon icon={"fluent:add-16-regular"}>{' '}</InlineIcon>
					</button>
				</div>
			</div>
		</div>
	)
}