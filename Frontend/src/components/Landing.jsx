import globe from "../assets/Globe.png"
function Landing(){
    return(
        <div className="grid gird-rows-2 md:grid-cols-2 p-10 content-center">
            <div className="max-[767px]:row-start-2">
                <div className="flex flex-col items-center justify-around h-[100%]">
                    <h1 className=" font-bold text-6xl lg:text-[5rem] uppercase max-[767px]:pt-10 max-[767px]:text-center">share ride, save money, make friends!</h1>
                    <div className="max-[767px]:pt-10">
                        <p className="text-slate-400 text-xl max-[767px]:text-center">Its simple and its free. Play your part in reducing Carbon Footprint and help Mother Nature to sustain its beauty. So what are you waiting for ? Lets ride together</p>
                    </div>
                </div>
            </div>
            <div className="justify-self-center">
                <img src={globe}/>
            </div>
        </div>
    )
}

export default Landing;