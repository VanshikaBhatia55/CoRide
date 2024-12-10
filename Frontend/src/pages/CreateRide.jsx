import { InlineIcon } from '@iconify/react';
import Navbar from "../components/Navbar"
import CreateRideComponent from "../components/CreateRideComponent"
import ride from "../assets/createRide.svg"
import publishRide from "../assets/publishRide.svg"
import Footer from '../components/Footer';
export default function CreateRide(){
    const descs = {
        desc1: "Share your ride with other people on your way and save every time you travel by car. Sign up and publish your ride to start saving on travel costs.",
        desc2: "We check our members both passengers and drivers.We verify ratings, profiles and IDs, so you know exactly who you are travelling with",
        desc3: "With CoRide we have made the entire experience of carpooling simple, son you can easily publish your ride and find other people to share your ride with on your way."
    }
    const headings = {
        heading1: "Save money every time you travel",
        heading2: "Proper verification",
        heading3: "Carpooling made simple"
    }
    const publishHeadings = {
        heading1: "Create a CoRide account",
        heading2: "Publish your ride",
        heading3: "Choose who you want to travel with"
    }
    const publishDescs = {
        desc1: "Sign up as a ride publisher and add profile picture, few goverment issued documents and your phone number for verification.",
        desc2: "Provide departure and arrival time, location and arrival point, the date of the ride and a price.",
        desc3: "Before accepting a request you can review a passengers profile to select if you want to travel with them or not."
    }
    return(
        <div className="bg-neutral-100">
            <Navbar/>
            <div className="flex flex-col px-1 py-2 pb-8 bg-green-100 ">
                <div className="text-3xl font-semibold text-center text-slate-800 py-10 lg:text-6xl">
                    <span>Create a ride and save on travle costs by sharing your ride with other people</span>
                </div>
                <div className='flex flex-col md:flex-row gap-2 justify-around'>
                    <div className="md:min-w-[380px]">
                        <CreateRideComponent />
                    </div>
                    <div className='self-end md:pb-10'>
                        <img src={ride} alt="" draggable={false}/>
                    </div>
                </div>
            </div>
            <div className=' px-2 py-8 lg:px-4 bg-white'>
                <span className='text-4xl font-semibold'>Benefits of carpooling with CoRide</span>
                <div className='mt-5'>
                    <div className="flex flex-col gap-2 px-4 lg:flex-row">
                        <Para image={"fluent-mdl2:savings"} heading={headings.heading1} desc={descs.desc1} />
                        <Para image={"fluent:person-square-checkmark-32-regular"} heading={headings.heading2} desc={descs.desc2} />
                        <Para image={"fluent:fast-acceleration-20-filled"} heading={headings.heading3} desc={descs.desc3} />
                    </div>
                </div>
            </div>
            <div className='p-2'>
                <div className='text-4xl p-2 mb-3 font-semibold text-center'>
                    <span>Publish your ride just a few clicks</span>
                </div>
                <div className='flex flex-col lg:flex-row lg:justify-center gap-4'>
                    <div className='self-center md:flex md:justify-center'>
                        <div><img src={publishRide} alt="" className='max-h-[500px]'/></div>
                    </div>
                    <div className='flex flex-col gap-3 justify-evenly'>
                        <PublishRidePara image={"fluent:person-28-regular"} heading={publishHeadings.heading1} desc={publishDescs.desc1} />
                        <PublishRidePara image={"fluent:vehicle-car-32-regular"} heading={publishHeadings.heading2} desc={publishDescs.desc2} />
                        <PublishRidePara image={"fluent:preview-link-20-regular"} heading={publishHeadings.heading3} desc={publishDescs.desc3} />
                    </div>
                </div>

            </div>
            <Footer/>
        </div>
    )
}

function Para({image,heading,desc}){
    return(
        <div>
            <div className="text-4xl text-slate-600 lg:text-5xl"><InlineIcon icon={image} >{' '}</InlineIcon></div>
            <p className="text-md font-bold pt-1 lg:text-xl">{heading}</p>
            <p className="text-slate-500">{desc}</p>
        </div>
    )
}
function PublishRidePara({image,heading,desc}){
    return(
        <div className='flex items-center gap-4'>
            <div className="text-4xl text-slate-600 lg:text-6xl"><InlineIcon icon={image} >{' '}</InlineIcon></div>
            <div>
                <p className="text-md font-bold lg:text-2xl">{heading}</p>
                <p className="text-slate-500 lg:text-xl max-w-[75ch]">{desc}</p>
            </div>
        </div>
    )
}