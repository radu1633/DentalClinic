import React from "react";
import { ReactTyped } from "react-typed";
import Navbar from "../Navbar/Navbar";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    isLoggedIn
      ? document
          .getElementById("booking")
          ?.scrollIntoView({ behavior: "smooth" })
      : navigate("/login-page");
  };

  return (
    <>
      <section className="w-full overflow-x-hidden" id="home">
        <Navbar />
        <div className="flex justify-center min-h-screen bg-[url('/images/background-hero.jpg')] bg-center bg-cover bg-no-repeat overflow-hidden ">
          <div className="flex flex-col justify-center mx-auto md:mx-20 lg:mx-32 z-20 py-10 md:py-0 relative max-w-[400px] md:max-w-[525px]">
            <div className="text-center space-y-4 ">
              <h1 className="text-3xl sm:text-4xl md:text-5xl leading-snug font-bold text-white">
                Your Smile, Our <span className="text-primary ">Priority</span>
              </h1>
              <h3 className="text-white text-md md:text-lg pb-3">
                Experience exceptional dental care designed to keep your teeth
                healthy and your confidence shining.
              </h3>
              <button
                onClick={handleClick}
                className="btn text-sm py-3 px-5 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
