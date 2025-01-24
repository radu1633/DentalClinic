import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";

const Booking = () => {
  const { isLoggedIn } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState({
    id: "",
    title: "",
    description: "",
    duration: "",
    price: "",
  });
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      fetch("http://localhost:5098/api/Category")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch services");
          }
          return response.json();
        })
        .then((data) => {
          const transformedServices = data.map((category) => ({
            category: category.category_name,
            procedures: category.services.map((service) => ({
              id: service.service_id,
              title: service.name,
              description: service.description,
              duration: service.duration,
              price: service.price,
            })),
          }));
          setServices(transformedServices);
        })
        .catch((error) => console.error("Error fetching services:", error));
    };

    const fetchUserInfo = async () => {
      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `http://localhost:5098/api/Account/user/me`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok)
            throw new Error("Failed to fetch user information.");

          const data = await response.json();
          setUserInfo({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.mail,
            phone: data.phoneNumber,
          });
        } catch (error) {
          console.error("Error fetching user information:", error);
          alert("Failed to fetch user information. Please try again.");
        }
      }
    };

    fetchUserInfo();
    fetchServices();
  }, [isLoggedIn]);

  const handleServiceChange = (e) => {
    const selectedTitle = e.target.value;
    const selectedCategory = services.find((category) =>
      category.procedures.some((service) => service.title === selectedTitle)
    );

    const service = selectedCategory
      ? selectedCategory.procedures.find(
          (service) => service.title === selectedTitle
        )
      : null;

    setSelectedService(
      service || { id: "", title: "", description: "", duration: "", price: "" }
    );
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    const isWeekend = (date) => {
      const day = new Date(date).getDay();
      return day === 0 || day === 6;
    };

    if (isWeekend(date)) {
      alert("Weekends are not allowed. Please select a weekday.");
      setSelectedDate("");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5098/api/Appointment/available-hours?date=${date}`
      );

      if (!response.ok) throw new Error("Failed to check availability");
      const data = await response.json();

      if (data) {
        setAvailableTimes(data);
      } else {
        alert("This date is fully booked. Please choose another day.");
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Failed to check availability. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (selectedDate && selectedTime && selectedService) {
      try {
        const response = await fetch("http://localhost:5098/api/Appointment", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId: selectedService.id,
            date: `${selectedDate} ${selectedTime}`,
          }),
        });

        console.log(
          JSON.stringify({
            serviceId: selectedService.id,
            date: `${selectedDate} ${selectedTime}`,
          })
        );

        if (!response.ok) throw new Error("Failed to book the appointment");

        if (response.ok) {
          alert("Appointment successfully booked!");
          setSelectedDate("");
          setSelectedTime("");
          setSelectedService("");
          setAvailableTimes([]);
        } else {
          alert("Failed to book the appointment. Please try again.");
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
        alert("Failed to book the appointment. Please try again.");
      }
    }
  };

  return (
    <>
      <section id="booking" className=" w-full pt-4 pb-14 flex justify-center">
        <div className="bg-blue-100/40 py-8 md:py-14 px-14 md:px-28 rounded-2xl md:rounded-full relative">
          <img
            src="/images/tooth.png"
            alt="Tooth Icon"
            className="absolute top-[-55px] md:top-7 right-[-40px] md:right-6 w-32 h-32 transform rotate-[15deg]"
          />
          <div className="max-w-7xl mx-auto text-center mb-10 md:mb-16 mt-8 md:mt-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-secondary">
              Book Appointment
            </h2>
          </div>

          <div className="max-w-lg mx-auto">
            <form className="space-y-2 md:space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-secondary font-semibold mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userInfo.firstName}
                    className="w-full text-gray-600 md:w-full h-[40px] p-3 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                    required
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-gray-700 font-semibold mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userInfo.lastName}
                    className="w-full text-gray-600 h-[40px] p-3 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInfo.email}
                    className="w-full text-gray-600 h-[40px] p-3 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                    required
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 font-semibold mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userInfo.phone}
                    className="w-full text-gray-600 h-[40px] p-3 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-gray-700 font-semibold mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full h-[47px] p-3 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-gray-700 font-semibold mb-1"
                  >
                    Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full h-[47px] text-sm p-3 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                    required
                    disabled={!selectedDate}
                  >
                    <option value="">Select a time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="service"
                  className="block text-gray-700 font-semibold mb-1"
                >
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={selectedService.title || ""}
                  onChange={handleServiceChange}
                  className="w-full h-[50px] text-sm p-3 mb-7 rounded-xl border border-gray-200 focus:outline-none ring-2 ring-lightpink focus:ring-secondary"
                  required
                >
                  <option value="">Select a service</option>
                  {services.map((category, categoryIndex) => (
                    <optgroup key={categoryIndex} label={category.category}>
                      {category.procedures.map((service) => (
                        <option key={service.id} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div className="text-center mt-5">
                <button type="submit" className="btn px-6 py-2">
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Booking;
