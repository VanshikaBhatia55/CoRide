
import React, { useEffect } from 'react'

import { GiHamburgerMenu } from "react-icons/gi";
import Coride_Logo from "./../assets/Coride_Logo.png"
import {Link} from "react-router-dom"
import { useState } from 'react';
import axios from "axios"
import { useAuth0 } from '@auth0/auth0-react';
function Navbar() {
    const [navbarVisible, setNavBarVisible]= useState(false);
    const {loginWithRedirect,user,isAuthenticated,logout,getAccessTokenSilently} = useAuth0();
    
    if(isAuthenticated){
        const token = async()=>{
            const t = await getAccessTokenSilently();
            // console.log(t);
        }
        token();
    }
    const handleNavbar=()=>{
        setNavBarVisible(!navbarVisible);
    }
    const handleLogin = async () =>{
        const link = (window.location.href).replace("http://localhost:5173","");
        // console.log(link);
        await loginWithRedirect({
            appState: {
                returnTo: `${link}`
            }
        });
    }
    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };
    useEffect(()=>{
        const checkUser= async()=>{
            if (user){
                // console.log(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`,user);

                await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signin`,user)
                .catch((err)=>{
                    console.log(err);
                })
            }
        }
        checkUser();
    }, [user])
  return (
    <div className='flex items-center justify-between w-full h-[100px] px-10 overflow-hidden bg-white'>
        <div>
            <img src={Coride_Logo} alt="Logo" className='w-[100px] h-[100px]' draggable="false"/>
        </div>
        <div className=' px-4'>
            <div className={`hidden md:flex  md:gap-10 items-center`}>
                <Link to="/">Home</Link>
                {
                    isAuthenticated && (
                        <Link to='/myRides'>My Rides</Link>
                    )
                }
                <Link to="/create-ride">Create ride</Link>
                <Link to={`${isAuthenticated?"/profile":"/"}`}>{isAuthenticated?"Profile":"CoRide Benefits"}</Link>
                { !isAuthenticated && (
                    <button className='bg-[#86bd81] w-[182px] h-[51px] rounded-md hover:bg-[#79936e] hover:font-semibold text-white duration-200' onClick={handleLogin}>Get Started</button>
                )}
                { isAuthenticated && (
                    <button className='bg-[#86bd81] w-[182px] h-[51px] rounded-md hover:bg-[#79936e] hover:font-semibold text-white duration-200' onClick={handleLogout}>Log out</button>
                )}

                {/* <button className='bg-[#86bd81] w-[182px] h-[51px] rounded-md hover:bg-[#79936e] hover:font-semibold text-white duration-200' onClick={(e)=>loginWithPopup()}>Get Started</button> */}
            </div>
            <div className={`md:hidden ${navbarVisible?"hidden":"block"}`} onClick={handleNavbar}>
                <GiHamburgerMenu/>
            </div>
        </div>
        {/*  responsive navbar  */}
        {
            navbarVisible&&(
                <div className='md:hidden absolute top-4 right-0 w-1/2 border bg-white z-50 pb-10'>
                    <div className=' relative w-full h-full'>
                        <div className="cross absolute top-4 right-14 font-semibold text-2xl z-50" onClick={handleNavbar}>X</div>
                        <div className="link pt-20 flex flex-col gap-4 relative">
                            <Link className='w-full h-[50px]  pt-2 text-lg font-semibold px-4 hover:bg-gray-300' to="/"> Home </Link>
                            {
                                isAuthenticated && (
                                    <Link to='/myRides' className='w-full h-[50px]  pt-2 text-lg font-semibold px-4 hover:bg-gray-300'>My Rides</Link>
                                )
                            }
                            <Link className='w-full h-[50px]  pt-2 text-lg font-semibold px-4 hover:bg-gray-300' to="/create-ride">Create ride</Link>
                            <Link className='w-full h-[50px]  pt-2 text-lg font-semibold px-4 hover:bg-gray-300' to={`${isAuthenticated?"/profile":"/"}`}>{isAuthenticated?"Profile":"CoRide Benefits" }</Link>
                            { !isAuthenticated && (
                                <button className='bg-[#86bd81] w-[182px] h-[51px] rounded-md hover:bg-[#79936e] hover:font-semibold text-white duration-200' onClick={handleLogin}>Get Started</button>
                            )}
                            { isAuthenticated && (
                                <button className='bg-[#86bd81] w-[182px] h-[51px] rounded-md hover:bg-[#79936e] hover:font-semibold text-white duration-200' onClick={handleLogout}>Log out</button>
                            )}
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default Navbar

 {/* <div className={`hidden  border w-1/2 h-1/2 border-blacktop-10 duration-300 md:hidden ${navbarVisible?'block':'block'} `}>
            <div className='w-full relative'>
                <div className='absolute right-14 -top-2 text-2xl font-bold' onClick={handleNavbar}>X</div>
            </div>
        </div> */}