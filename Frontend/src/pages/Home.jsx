import Footer from "../components/Footer"
import Landing from "../components/Landing"
import Landing2 from "../components/Landing2"
import Navbar from "../components/Navbar"
import TripInputs from "../components/TripInputs"
import {  useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
function Home() {
  // const navigate = useNavigate()
  // const{user}= useAuth0();
  // console.log(user);
  // useEffect(()=>{
  //   if (user){
  //     navigate("/create-ride")
  //   }
  //   else{
  //     navigate("/");
  //   }
  // },[user])
  return (
    <div className="bg-neutral-100">
        <Navbar/>
        <Landing/>
        <TripInputs/>
        <Landing2/>
        <Footer/>
    </div>
  )
}

export default Home