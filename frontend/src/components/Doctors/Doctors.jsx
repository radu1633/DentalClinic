import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`http://localhost:5098/api/Doctor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();

      const formattedDoctors = data.map((doctor) => ({
        id: doctor.id,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        specialization: doctor.specialization,
        experienceYears: doctor.experienceYears,
        imageSrc: doctor.imageSrc,
      }));

      setDoctors(formattedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("An error occurred while fetching doctors.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1044,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="mx-auto min-h-screen mt-20 md:mt-0">
      <div className=" w-3/4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-3">
          Our <span className="text-primary">Doctors</span>
        </h2>
        <h3 className="font-semibold text-primary/40 text-center mb-28">
          Meet our expert medical team dedicated to your health.
        </h3>
        <Slider {...settings}>
          {doctors.map((doc) => (
            <div key={doc.id} className="p-5 shadow-xl rounded-xl mb-8">
              <div className="text-center">
                <img
                  src={doc.imageSrc}
                  alt={`${doc.firstName} ${doc.lastName}`}
                  className="w-32 h-32 rounded-full border-8 border-blue-100 hover:border-0 duration-500 mx-auto  mb-4 object-cover"
                />
                <h3 className="text-lg lg:text-xl font-semibold text-blue-900">
                  Dr. {doc.firstName} {doc.lastName}
                </h3>
                <p className="text-gray lg:text-lg">{doc.specialization}</p>
                <p className="text-gray text-sm lg:text-base">
                  {doc.experienceYears} experience years
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Doctors;
