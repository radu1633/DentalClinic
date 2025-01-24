import React from "react";
import { useAuth } from "../AuthContext/AuthContext";
import Booking from "../Booking/Bookings";

const Services = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section className="w-full min-h-screen py-9 px-10" id="services">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-secondary pb-2">
          Our <span className="text-primary">Services</span>
        </h2>
      </div>
      <h3 className="text-center lg:text-lg font-semibold text-primary/40 mb-14">
        Comprehensive care for healthy, beautiful smiles - from prevention to
        restoration
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-20 max-w-6xl mx-auto">
        {[
          {
            title: "Preventive & Pediatric Dentistry",
            description:
              "Focused on maintaining oral health and providing specialized care for patients of all ages, including children, to ensure healthy smiles for a lifetime.",
            img: "/images/category1.jpg",
          },
          {
            title: "Cosmetic & Restorative Dentistry",
            description:
              "Enhance the beauty and function of your smile with advanced treatments designed to repair damage, restore confidence, and achieve your aesthetic goals.",
            img: "/images/category2.jpg",
          },
        ].map((category, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
              <img
                src={category.img}
                alt={category.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-primary/80 mb-3">
                {category.title}
              </h3>
              <p className="text-gray text-sm leading-snug">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-14 md:mt-10 mb-16">
        <a href="/services-page">
          <button className="btn py-3 px-8">See Services</button>
        </a>
      </div>

      {isLoggedIn && <Booking />}
    </section>
  );
};

export default Services;
