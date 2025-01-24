import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext/AuthContext";

const Navbar = () => {
  const { isLoggedIn } = useAuth();
  const navbarItems = [
    {
      id: 1,
      title: "Home",
      link: "#home",
    },
    {
      id: 2,
      title: "About",
      link: "#about",
    },
    {
      id: 3,
      title: "Services",
      link: "#services",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-30 bg-transparent text-white">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold">GlowSmile</h1>
          <div className="hidden md:flex space-x-4">
            <ul className="flex ">
              {navbarItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    className={`px-4 ${
                      isLoggedIn ? "md:px-5" : "md:px-7"
                    } py-2 hover:font-bold transition duration-300`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
              {isLoggedIn && (
                <li>
                  <a
                    href="#booking"
                    className="px-4 py-2 hover:font-bold transition duration-300"
                  >
                    Appointments
                  </a>
                </li>
              )}
              <a
                className="btn px-2 bg-primary/30 hover:bg-primary/70"
                href={isLoggedIn ? "/profile-page" : "/login-page"}
              >
                {isLoggedIn ? <FontAwesomeIcon icon={faUser} /> : "Login"}
              </a>
            </ul>
          </div>

          <div
            className="md:hidden text-2xl cursor-pointer"
            onClick={toggleMenu}
          >
            <FontAwesomeIcon icon={!isOpen ? faBars : faXmark} />
          </div>
        </div>

        <div
          className={`${
            isOpen ? "translate-x-0" : "translate-x-[140%]"
          } md:hidden flex items-center transition-transform duration-700 ease-in-out absolute top-14 right-0 left-0 mx-auto bg-blue-200/90 z-30 rounded-xl my-5 w-9/12 ${
            isLoggedIn ? "h-[550px]" : "h-[400px]"
          } text-white`}
        >
          <ul className="space-y-8 flex-col w-full px-4 py-6">
            {navbarItems.map((item) => (
              <li
                key={item.id}
                className="rounded-xl py-2 font-semibold hover:bg-primary/30 hover:shadow-lg cursor-pointer w-full text-center"
              >
                <a href={item.link} className="block w-full">
                  - {item.title} -
                </a>
              </li>
            ))}
            {isLoggedIn && (
              <li className="rounded-xl py-2 font-semibold hover:bg-primary/30 hover:bg-opacity-40 hover:shadow-lg cursor-pointer w-full text-center">
                <a href="#booking" className="block w-full">
                  - Appointments -
                </a>
              </li>
            )}
            <li className="rounded-xl py-2 font-semibold hover:bg-primary/30 hover:shadow-lg cursor-pointer w-full text-center">
              <a
                href={isLoggedIn ? "/profile-page" : "/login-page"}
                className="block w-full"
              >
                {isLoggedIn ? "- Profile -" : "- Login -"}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
