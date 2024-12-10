import React, { useState } from "react";
import { useEffect, useMemo } from "react";
import { InlineIcon } from "@iconify/react";
import Navbar from "../components/Navbar";
import Calender from "../components/Calender";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import {
  searchSourceAtom,
  searchDestAtom,
  searchDateAtom,
  searchSeatsAtom,
} from "../atoms/searchRideAtoms";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {loadStripe} from "@stripe/stripe-js"
function BulkRides() {
  const sourceCity = useRecoilValue(searchSourceAtom);
  const destinationCity = useRecoilValue(searchDestAtom);
  const date = useRecoilValue(searchDateAtom);
  const seats = useRecoilValue(searchSeatsAtom);
  const [updateView, setUpdateView] = useState(true);
  const [rides, setRides] = useState([]);
  const [publishableKey , setPublishableKey]= useState("");
  const { user } = useAuth0();
  const navigate = useNavigate();
  let isMobile = undefined;
  const [dialogVisible, setDialogVisible] = useState(false);
  const [rideDetails, setRideDetails] = useState({
    amount: 0,
    origin: "",
    destination: "",
    useremail: "",
    rideId: 0,
    seatsRequired: 0,
    driverId:1,
  });
  // const [stripePromise , setStripePromise]= useState(null);
  // const [clientSecret, setClientSecret]= useState("");
  // const getPublishableKey=async()=>{
  //   const {data}= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payments/pubKey`);
  //   // console.log(data);
  //   setStripePromise(loadStripe(data.PublishableKey))

  // }
  // useEffect(()=>{
  //   getPublishableKey();
  // }, [])




  useEffect(() => {
    const handleResize = () => {
      isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        setUpdateView(false);
      } else {
        setUpdateView(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


    const getRideDetails = async()=>{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/rides/fetch?SC=${sourceCity}&DC=${destinationCity}&date=${date}&seats=${seats}`);
       setRides(response.data.rides);
       if (isMobile){
        setUpdateView(false)
       }
       console.log(rides);
    }


  useEffect(() => {
    getRideDetails();
    // getPublishableKey();
  }, []);
  const checkoutHandler = async () => {
      const {data}= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payments/checkout`, {
        rideDetails,
        paymentMode:"Online"
      });
      console.log(data);
      if (data.url){
        window.location.href=data.url
      }
  };
  const addPassengerCash = async () => {
    // setPaymentMode('Cash');
    const {data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payments/checkout`, {
        rideDetails,
      });
      navigate("/myRides")
  };
  const addPassengerDigital = async () => {
    await checkoutHandler();
  };
  return (
    <div>
      <Navbar />
      <div
        onClick={() => {
          setUpdateView(!updateView);
        }}
        className=" max-w-[570px] mx-auto lg:hidden"
      >
        <div className=" text-center duration-500 ease-in-out">
          {updateView ? "Hide Search details" : "Show Search details"}{" "}
        </div>
      </div>
      <div className="relative z-0">
        {updateView && (
          <div className=" w-full h-10 lg:sticky lg:top-0 grid grid-cols-1 max-w-[550px] mx-auto lg:min-w-full lg:grid-cols-5 items-center justify-between px-6 bg-white">
            <CitySearch
              placeholder={"Leaving from"}
              atomName={searchSourceAtom}
            />
            <CitySearch placeholder={"Going to"} atomName={searchDestAtom} />
            <Calender atomName={searchDateAtom} />
            <PassengerCount title={"passenger"} atomName={searchSeatsAtom} />
            <button
              className=" border py-2 font-semibold bg-[#489d72] rounded-xl"
              onClick={getRideDetails}
            >
              Update Search
            </button>
          </div>
        )}
        <div className="w-full min-h-screen border mt-10">
          {rides.length <= 0 && (
            <div className="flex flex-col items-center justify-center w-full min-h-screen border">
              <p className="break-words px-6 py-4">
                Ohhh! No rides available for your search 😥😥😥...
              </p>
              <p
                onClick={() => setUpdateView(!updateView)}
                className="underline text-blue-500 lg:hidden"
              >
                Update search details{" "}
              </p>
            </div>
          )}
          {rides &&
            rides.map((ride, i) => {
              return (
                <div
                  key={i}
                  className="bg-slate-200 px-10 my-2 flex flex-col lg:flex-row"
                >
                  <div className="w-full lg:w-10/12 flex flex-row gap-2 lg:pr-4 py-4">
                    {/* sources div */}
                    <div className="w-full py-2 flex flex-col justify-center items-center">
                      <h2 className="text-2xl font-semibold text-center text-slate-700">
                        {ride.origin}
                      </h2>
                      <h3 className="text-center">
                        {ride.departureTime.split("T")[1].split(".")[0]}
                      </h3>
                    </div>
                    {/* destination div */}
                    <div className="w-full py-2 flex justify-center items-center flex-col px-2">
                      <h2 className="text-2xl font-semibold text-center text-slate-700">
                        {ride.destination}
                      </h2>
                      <h3 className="text-center">
                        {ride.EstimatedArrivalTime.split("T")[1].split(".")[0]}
                      </h3>
                    </div>
                    <div className="w-full flex justify-center items-center">
                      <h1 className="lg:text-xl font-semibold">
                        Seats:{ride.seatsRemaining}
                      </h1>
                    </div>
                  </div>
                  <div className="lg:w-2/12 flex items-center justify-center">
                    <button
                      className="w-full font-semibold text-lg bg-green-400 rounded-full py-2 mb-2 lg:mb-0"
                      onClick={(e) => {
                        setRideDetails({
                          amount: parseInt(ride.price) * seats,
                          origin: ride.origin,
                          destination: ride.destination,
                          useremail: user.email,
                          rideId: ride.rideId,
                          seatsRequired: seats,
                          driverId:ride.driverId,
                        });
                        setDialogVisible(!dialogVisible);
                      }}
                    >
                      ₹ {parseInt(ride.price) * seats}
                    </button>
                  </div>
                </div>
              );
            })}
          {dialogVisible && (
            <div className="absolute -top-28 justify-center items-center left-1 right-1 flex flex-col  bg-white min-h-screen  gap-4  border border-black ">
              <h1
                className="text-white bg-green-400 px-10 py-2 rounded-full text-xl cursor-pointer hover:scale-110 duration-200 hover:bg-green-500"
                onClick={addPassengerCash}
              >
                Pay by Cash{" "}
              </h1>
              <h1
                className="text-white bg-green-400 px-10 py-2 rounded-full text-xl cursor-pointer hover:scale-110 duration-200 hover:bg-green-500"
                onClick={addPassengerDigital}
              >
                Pay Digitally{" "}
              </h1>
              <h1
                onClick={() => {
                  setDialogVisible(!dialogVisible);
                }}
                className="text-white bg-rose-400 px-6 py-2 rounded-full text-xl cursor-pointer hover:scale-110 duration-200 hover:bg-rose-500"
              >
                Close
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CitySearch({ placeholder, atomName }) {
  const atomGetter = useRecoilValue(atomName);
  const atomSetter = useSetRecoilState(atomName);
  return (
    <div className="relative grow">
      <div className="border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0 py-2 lg:mx-2">
        <div className="absolute left-0 top-0 bottom-0 p-2">
          <div className="flex justify-center flex-col h-full lg:pl-2">
            <InlineIcon icon={"fluent:circle-32-regular"}> </InlineIcon>
          </div>
        </div>
        <input
          type="text"
          value={atomGetter}
          onChange={(e) => atomSetter(e.target.value)}
          name={placeholder.split(" ")[0]}
          id=""
          required
          placeholder={placeholder}
          className="pl-[28px] py-2 hover:bg-slate-100 w-full border-transparent rounded-md focus:outline-none focus:border-transparent focus:ring-0"
        />
      </div>
    </div>
  );
}
export function PassengerCount({ title, atomName }) {
  const atomGetter = useRecoilValue(atomName);
  const atomSetter = useSetRecoilState(atomName);

  const passenger = useMemo(() => {
    if (atomGetter == 1) {
      return title;
    } else {
      const text = title.split(" ");
      const ans = text[0] + "s ";
      text.shift();
      return ans + text.join(" ");
    }
  }, [atomGetter, title]);

  const increaseCheckCount = () => {
    if (atomGetter == 6) return;
    atomSetter(() => atomGetter + 1);
  };
  const decreaseCheckCount = () => {
    if (atomGetter == 1) return;
    atomSetter(() => atomGetter - 1);
  };

  return (
    <div className=" py-2 grow">
      <div className="flex justify-between bg-white px-2 py-1 hover:bg-slate-100 rounded-lg lg:mx-2">
        <div className="flex gap-3 items-center">
          <div className="text-3xl">
            <InlineIcon icon={"fluent:person-28-regular"}> </InlineIcon>
          </div>
          <span className="">
            {atomGetter} {passenger}
          </span>
        </div>
        <div className="flex gap-4 text-2xl">
          <button
            type="button"
            onClick={decreaseCheckCount}
            className="rounded-lg hover:bg-slate-200"
          >
            <InlineIcon icon={"fluent:subtract-28-filled"}> </InlineIcon>
          </button>
          <button
            type="button"
            onClick={increaseCheckCount}
            className=" rounded-lg hover:bg-slate-200"
          >
            <InlineIcon icon={"fluent:add-16-regular"}> </InlineIcon>
          </button>
        </div>
      </div>
    </div>
  );
}
export default BulkRides;
