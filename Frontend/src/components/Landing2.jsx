import homeMobile from "../assets/Home_Mobile.png";
import circle from "../assets/circle.svg";
import clock from "../assets/TimeChase.png";
import money from "../assets/Money.png";
import support from "../assets/Support.png";
function Landing2(){
    return(
        <div>
            <div className="text-center flex flex-col items-center">
                <p className="p-10 font-bold uppercase text-4xl lg:text-[4rem]">How <span className="text-green-400">CoRide</span> works</p>
                <p className="max-w-[45ch]">Download and install the CoRide app. Enter your phone number and make your user account. when approved you may start driving.</p>
            </div>
            <div className="grid gird-cols-6 md:grid-cols-3 md:grid-rows-2 p-10 gap-8">
                <div className="grid justify-items-center md:justify-items-end content-start">
                    <div className="relative">
                        <img src={circle} alt="1" />
                        <div className="flex justify-center items-center w-[100%] h-[98%] absolute  bottom-0 top-0 left-0 rigth-0 text-center">
                            <p className="text-green-400 text-3xl font-bold">1</p>
                        </div>
                    </div>
                    <p className="font-bold">REQUEST A RIDE</p>
                    <p className="text-gray-500 max-w-[45ch] text-center md:text-right">Have to reach office or going for shopping ?<br></br> Just put your current location and destination and search a ride that suits you</p>
                </div>
                <div className="grid justify-items-center md:justify-items-start content-start">
                    <div className="relative">
                        <img src={circle} alt="2" />
                        <div className="flex justify-center items-center w-[100%] h-[98%] absolute  bottom-0 top-0 left-0 rigth-0 text-center">
                            <p className="text-green-400 text-3xl font-bold">2</p>
                        </div>
                    </div>
                    <p className="font-bold">POST A RIDE</p>
                    <p className="text-gray-500 max-w-[45ch] text-center md:text-left">Going somewhere but hate to travel alone - just post your ride details and publish it.</p>
                </div>
                
                <div className="relative row-span-2 row-start-1 md:col-start-2 md:row-start-1 justify-self-center">
                    <div className="relative ">
                        <div className="rounded-full bg-green-400 w-[120%] h-[60%] absolute top-[15%] left-[-10%] z-0">
                        </div>
                        <img src={homeMobile} alt="" className="z-10 relative"/>
                    </div>
                </div>
                
                <div className="grid justify-items-center md:justify-items-end content-start">
                    <div className="relative">
                        <img src={circle} alt="3" />
                        <div className="flex justify-center items-center w-[100%] h-[98%] absolute  bottom-0 top-0 left-0 rigth-0 text-center">
                            <p className="text-green-400 text-3xl font-bold">3</p>
                        </div>
                    </div>
                    <p className="font-bold">INSTANT NOTIFICATIONS</p>
                    <p className="text-gray-500 max-w-[45ch] text-center md:text-right">Get instant notifications for your rides and be in contact with fellow riders all the time</p>
                </div>
                <div className="grid justify-items-center md:justify-items-start content-start">
                    <div className="relative">
                        <img src={circle} alt="4" />
                        <div className="flex justify-center items-center w-[100%] h-[98%] absolute  bottom-0 top-0 left-0 rigth-0 text-center">
                            <p className="text-green-400 text-3xl font-bold">4</p>
                        </div>
                    </div>
                    <p className="font-bold">CASHLESS PAYMENT</p>
                    <p className="text-gray-500 max-w-[45ch] text-center md:text-left">Payment made easy by using your own Wallet - no more cash to carry</p>
                </div>
            </div>


            {/* Coride benefits */}

            <div className="font-bold text-5xl p-10 text-center">
                <span className="text-green-400">CoRide</span> Benefits
            </div>
            <div className="grid p-5 md:gap-5 md:p-10">
                <div className="flex justify-between flex-col md:flex-row md:w-[85%] rounded-lg bg-white p-5 m-5">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-cetner">
                            <p className="text-green-400 text-6xl pr-5">01.</p>
                            <p className="flex items-center font-bold text-2xl md:text-xl">Flexible<br></br> working hours</p>
                        </div>
                        <div>
                            <p className="max-w-[45ch] text-[1.25rem] pt-3 text-gray-400 text-center">You can decide when, and how much time you want to drive.</p>
                        </div>
                    </div>
                    <div className="md:px-10">
                        <img src={clock} alt="" className="m-auto"/>
                    </div>
                </div>
                <div className="md:justify-self-end flex flex-col md:flex-row-reverse justify-between md:w-[85%] rounded-lg bg-white p-5 m-5">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-cetner">
                            <p className="text-green-400 text-6xl pr-5">02.</p>
                            <p className="flex items-center font-bold text-2xl md:text-xl">Earnings</p>
                        </div>
                        <div>
                            <p className="max-w-[45ch] text-[1.25rem] pt-3 text-gray-400 text-center">By driving with CoRide you can earn more.</p>
                        </div>
                    </div>
                    <div className="md:px-10">
                        <img src={money} alt="" className="m-auto" />
                    </div>
                </div>
                <div className="flex justify-between flex-col md:flex-row md:w-[85%] rounded-lg bg-white p-5 m-5">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-cetner">
                            <p className="text-green-400 text-6xl pr-5">03.</p>
                            <p className="flex items-center font-bold text-2xl md:text-xl">Customer<br></br> support 24/7</p>
                        </div>
                        <div>
                            <p className="max-w-[55ch] text-[1.25rem] pt-3 text-gray-400 text-center">CoRide is proud to support you in your local language. We are proud to be at your service 24/7!</p>
                        </div>
                    </div>
                    <div className="md:px-10">
                        <img src={support} alt="" className="m-auto"/>
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Landing2