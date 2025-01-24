import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faMagnifyingGlass,
  faArrowRightFromBracket,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext/AuthContext";
import { div, filter } from "framer-motion/client";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Admin = () => {
  const { logout, isLoggedIn, role, getRole } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (getRole() !== "Admin") {
      navigate("/");
    } else {
      fetchAppointments();
      fetchServices();
      fetchCategories();
      fetchDoctors();
    }
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (query === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (apt) =>
          apt.firstName.toLowerCase().includes(query) ||
          apt.lastName.toLowerCase().includes(query)
      );
      setFilteredAppointments(filtered);
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5098/api/Appointment/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error(
          "An error occurred while fetching appointments. Please try again later."
        );
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchServices = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5098/api/Service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error(
          "An error occurred while fetching appointments. Please try again later."
        );
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:5098/api/Category/only`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error(
          "An error occurred while fetching categories. Please try again later."
        );
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  const handleDeleteAppointment = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5098/api/Appointment/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Appointment successfully deleted");

        fetchAppointments();
      } else {
        throw new Error("Failed to delete appointment!");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category_id: "",
  });

  const handleAddService = async (e) => {
    e.preventDefault();

    const selectedCategory = categories.find(
      (category) => category.category_name === newService.category
    );

    if (!selectedCategory) {
      alert("Invalid category selected");
      return;
    }

    const serviceData = {
      name: newService.name,
      description: newService.description,
      price: newService.price,
      duration: newService.duration,
      category_id: selectedCategory.category_id,
    };

    try {
      const response = await fetch(`http://localhost:5098/api/Service/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        alert("Service successfully added");
        setNewService({
          name: "",
          description: "",
          price: "",
          duration: "",
          category_id: "",
        });
        fetchServices();
      } else {
        throw new Error("Failed to add service!");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const handleRemoveService = async (id) => {
    try {
      const response = await fetch(`http://localhost:5098/api/Service/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Service successfully deleted");

        fetchServices();
      } else {
        throw new Error("Failed to delete service!");
      }
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const [editService, setEditService] = useState(null);

  const handleEditService = async (service) => {
    setEditService({ ...service });
  };

  const handleSaveEditService = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5098/api/Service/${editService.service_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editService.name,
            description: editService.description,
            price: editService.price,
            duration: editService.duration,
          }),
        }
      );

      if (response.ok) {
        alert("Service successfully updated!");
        setEditService({
          name: "",
          description: "",
          price: "",
          duration: "",
        });
        fetchServices();
        setEditService(null);
      } else {
        throw new Error("Failed to update service!");
      }
    } catch (error) {
      console.error("Error updating service information:", error);
    }
    /*setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === editService.id ? editService : service
      )
    );
    setEditService(null);*/
  };

  const handleCancelEditService = () => {
    setEditService(null);
  };

  const [doctors, setDoctors] = useState([]);

  const [newDoctor, setNewDoctor] = useState({
    imageSrc: "",
    firstName: "",
    lastName: "",
    specialization: "",
    experienceYears: "",
    imageName: "",
    imageFile: null,
  });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (
      newDoctor.firstName &&
      newDoctor.lastName &&
      newDoctor.specialization &&
      newDoctor.experienceYears
    ) {
      try {
        const formData = new FormData();
        formData.append("FirstName", newDoctor.firstName);
        formData.append("LastName", newDoctor.lastName);
        formData.append("Specialization", newDoctor.specialization);
        formData.append("ExperienceYears", newDoctor.experienceYears);
        formData.append("ImageName", newDoctor.imageName);
        formData.append("ImageFile", newDoctor.imageFile);
        const response = await fetch("http://localhost:5098/api/Doctor", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Doctor successfully added!");
          setNewDoctor({
            firstName: "",
            lastName: "",
            specialization: "",
            experienceYears: "",
            imageName: "",
            imageFile: null,
          });
          fetchDoctors();
        } else {
          const errorData = await response.json();
          alert(
            `Failed to add doctor: ${
              errorData.message || "The added doctor isn't a user."
            }`
          );
          setNewDoctor({
            firstName: "",
            lastName: "",
            specialization: "",
            experienceYears: "",
            imageName: "",
            imageFile: null,
          });
        }
      } catch (error) {
        alert("An error occurred while adding the doctor.");
      }
    }
  };

  const handleRemoveDoctor = async (id) => {
    try {
      const response = await fetch(`http://localhost:5098/api/Doctor/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete doctor");
      alert("Doctor successfully deleted!");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("An error occurred while deleting the doctor.");
    }
  };

  const [editDoctor, setEditDoctor] = useState(null);

  const handleEditDoctor = (doctor) => {
    setEditDoctor(doctor);
  };

  const handleSaveEditDoctor = async (e) => {
    console.log(editDoctor.id);
    e.preventDefault();
    const formData1 = new FormData();
    formData1.append("firstName", editDoctor.firstName);
    formData1.append("lastName", editDoctor.lastName);
    formData1.append("specialization", editDoctor.specialization);
    formData1.append("experienceYears", editDoctor.experienceYears);

    try {
      const response = await fetch(
        `http://localhost:5098/api/Doctor/data/${editDoctor.id}`,
        {
          method: "PUT",
          body: formData1,
        }
      );
      if (!response.ok) throw new Error("Failed to update doctor");
      fetchDoctors();
      setEditDoctor(null);
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("An error occurred while updating the doctor.");
    }

    if (editDoctor.imageFile) {
      const formData2 = new FormData();
      formData2.append("ImageName", editDoctor.imageName);
      formData2.append("imageFile", editDoctor.imageFile);

      try {
        const response = await fetch(
          `http://localhost:5098/api/Doctor/image/${editDoctor.id}`,
          {
            method: "PUT",
            body: formData2,
          }
        );
        if (!response.ok) throw new Error("Failed to update doctor");
        alert("Doctor successfully updated!");
        fetchDoctors();
        setEditDoctor(null);
      } catch (error) {
        console.error("Error updating doctor:", error);
        alert("An error occurred while updating the doctor.");
      }
    }
  };

  const handleCancelEditDoctor = () => {
    setEditDoctor(null);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file && /\.(jpg|jpeg|png)$/i.test(file.name)) {
      const fileData = {
        imageFile: file,
        imageName: file.name,
      };
      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result;
        if (type === "new") {
          setNewDoctor((prev) => ({
            ...prev,
            ...fileData,
            imageSrc: previewUrl,
          }));
        } else if (type === "edit") {
          setEditDoctor((prev) => ({
            ...prev,
            ...fileData,
            imageSrc: previewUrl,
          }));
        }
      };
      reader.readAsDataURL(file); // Read the uploaded file as a data URL
    } else {
      alert("Please upload a valid image file (jpg, jpeg, png).");
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1209,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 929,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 645,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [activeSection, setActiveSection] = useState("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative bg-blue-50">
      <button
        className="md:hidden fixed text-2xl top-0 left-0 z-50 p-3 rounded-full text-secondary"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
      </button>
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:transform-none md:relative transition-transform duration-300 ease-in-out w-48 bg-blue-100  z-40`}
      >
        <div className="py-6 flex items-center flex-col">
          <h2 className="text-2xl font-bold text-primary text-center mb-10 mt-8">
            Admin Panel
          </h2>
          <ul className="space-y-5">
            <li>
              <button
                onClick={() => {
                  setActiveSection("appointments");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-center py-2 px-4  font-semibold ${
                  activeSection === "appointments"
                    ? "bg-blue-200 text-white"
                    : "text-secondary/80 hover:bg-blue-200/40"
                }`}
              >
                Appointments
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("services");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-center py-2 px-4 font-semibold ${
                  activeSection === "services"
                    ? "bg-blue-200 text-white"
                    : "text-secondary/80 hover:bg-blue-200/40"
                }`}
              >
                Services Management
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("doctors");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-center py-2 px-4 font-semibold ${
                  activeSection === "doctors"
                    ? "bg-blue-200 text-white"
                    : "text-secondary/80 hover:bg-blue-200/40"
                }`}
              >
                Doctors Management
              </button>
            </li>
          </ul>
          <button
            onClick={logout}
            className="px-3 fixed top-[600px] py-1 bg-primary/20 text-primary/60 hover:bg-primary/50 hover:text-white rounded-full font-semibold"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      </aside>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50  md:hidden"></div>
      )}
      <main className="flex-1 p-8">
        {activeSection === "appointments" && (
          <div className="mt-12">
            <div className="mb-6 flex flex-row gap-3">
              <input
                type="text"
                placeholder="Search by last name"
                className="w-96 px-4 py-2 bg-white/90 rounded-lg border-4 border-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch} className="btn px-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>

            <div className="min-h-scren overflow-y-auto overflow-x-auto ">
              <table className="min-w-full bg-white rounded-xl shadow-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left">First Name</th>
                    <th className="py-3 px-6 text-left">Last Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Phone</th>
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Time</th>
                    <th className="py-3 px-6 text-left">Service</th>
                    <th className="py-3 px-6 text-center"></th>
                  </tr>
                </thead>
                <tbody className="">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b">
                        <td className="py-3 px-3">{appointment.firstName}</td>
                        <td className="py-3 px-3">{appointment.lastName}</td>
                        <td className="py-3 px-3">{appointment.mail}</td>
                        <td className="py-3 px-3">{appointment.phoneNumber}</td>
                        <td className="py-3 px-3">{appointment.date}</td>
                        <td className="py-3 px-3">{appointment.time}</td>
                        <td className="py-3 px-3">{appointment.serviceName}</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                            className="bg-red-300 text-white rounded-xl py-2 px-4 font-bold hover:bg-red-400 transition duration-300"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-4 text-secondary font-semibold"
                      >
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === "services" && (
          <div>
            {editService && (
              <div className="z-50 fixed inset-0 bg-black/50 flex justify-center items-center">
                <div className="bg-white px-5 md:px-8 py-6 rounded-lg shadow-lg w-96 md:w-[550px]">
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-6 text-center">
                    Edit Service
                  </h3>
                  <form onSubmit={handleSaveEditService}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                      <div>
                        <label
                          htmlFor="editName"
                          className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="editName"
                          value={editService.name}
                          onChange={(e) =>
                            setEditService((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="editDescription"
                          className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                        >
                          Description
                        </label>
                        <textarea
                          id="editDescription"
                          value={editService.description}
                          onChange={(e) =>
                            setEditService((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label
                          htmlFor="editDuration"
                          className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                        >
                          Duration
                        </label>
                        <input
                          type="text"
                          id="editDuration"
                          value={editService.duration}
                          onChange={(e) =>
                            setEditService((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                          required
                        />
                      </div>
                      <div className="mb-3 md:mb-4">
                        <label
                          htmlFor="editPrice"
                          className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                        >
                          Price
                        </label>
                        <input
                          type="text"
                          id="editPrice"
                          value={editService.price}
                          onChange={(e) =>
                            setEditService((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={handleCancelEditService}
                        className="rounded-full btn font-semibold py-1.5 md:py-2 px-4 md:px-5 bg-gray-400 text-white transition duration-300 text-sm md:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-full btn font-semibold py-1.5 md:py-2 px-4 md:px-5 bg-gray-300 text-white text-sm md:text-base"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="flex justify-center mb-10">
              <form
                onSubmit={handleAddService}
                className="bg-white/50 px-5 md:px-8 py-6 rounded-lg shadow-lg w-96 md:w-[550px]"
              >
                <h3 className="text-xl font-bold text-secondary/50 mb-6 text-center">
                  Add New Service
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter service name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={newService.description}
                      onChange={(e) =>
                        setNewService((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter service description"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="duration"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      value={newService.duration}
                      onChange={(e) =>
                        setNewService((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter service duration"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Price
                    </label>
                    <input
                      type="text"
                      id="price"
                      value={newService.price}
                      onChange={(e) =>
                        setNewService((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter service price"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="category"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      value={newService.category}
                      onChange={(e) =>
                        setNewService((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base text-secondary"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.category_name}
                        >
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    type="submit"
                    className="rounded-lg btn bg-primary/50 py-1.5 px-4 md:px-5 text-sm md:text-base"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.service_id}
                  className="bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-lg font-bold text-primary">
                      {service.name}
                    </h4>
                    <p className="text-secondary text-sm">
                      {service.description}
                    </p>
                    <p className="text-secondary text-sm">
                      {service.duration} minutes
                    </p>
                    <p className="text-secondary text-sm">{service.price} $</p>
                    <p className="text-secondary text-sm">
                      Category: {service.category}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRemoveService(service.service_id)}
                      className="mt-3 btn bg-primary/50 text-white py-1.5 px-4 rounded-lg font-bold transition duration-300 text-sm"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEditService(service)}
                      className="mt-3 btn bg-primary/50 text-white py-1.5 px-4 rounded-lg font-bold  transition duration-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "doctors" && (
          <div>
            {editDoctor && (
              <div className="z-50 fixed inset-0 bg-black/50 flex items-center justify-center">
                <form
                  onSubmit={handleSaveEditDoctor}
                  className="bg-white px-5 md:px-8 py-6 rounded-lg shadow-lg w-96 md:w-[550px]"
                >
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-6 text-center">
                    Edit Doctor
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:gap-5">
                    <div>
                      <label
                        htmlFor="editImage"
                        className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                      >
                        Image URL
                      </label>
                      <input
                        type="file"
                        id="editImage"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleImageUpload(e, "edit")}
                        className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      />
                      {editDoctor.imageSrc && (
                        <div className="flex justify-center">
                          <img
                            src={editDoctor.imageSrc}
                            alt="Current Preview"
                            className="mt-3 w-24 h-24 object-cover rounded-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="editFirstName"
                          className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="editFirstName"
                          value={editDoctor.firstName}
                          onChange={(e) =>
                            setEditDoctor((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="editLastName"
                          className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="editLastName"
                          value={editDoctor.lastName}
                          onChange={(e) =>
                            setEditDoctor((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="editSpecialization"
                        className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                      >
                        Specialization
                      </label>
                      <input
                        type="text"
                        id="editSpecialization"
                        value={editDoctor.specialization}
                        onChange={(e) =>
                          setEditDoctor((prev) => ({
                            ...prev,
                            specialization: e.target.value,
                          }))
                        }
                        className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="editExperienceYears"
                        className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                      >
                        Experience Years
                      </label>
                      <input
                        type="number"
                        id="editExperienceYears"
                        value={editDoctor.experienceYears}
                        onChange={(e) =>
                          setEditDoctor((prev) => ({
                            ...prev,
                            experienceYears: e.target.value,
                          }))
                        }
                        className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={handleCancelEditDoctor}
                      className="rounded-full btn font-semibold py-1.5 md:py-2 px-4 md:px-5 bg-gray-400 text-white transition duration-300 text-sm md:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-full btn font-semibold py-1.5 md:py-2 px-4 md:px-5 bg-gray-300 text-white text-sm md:text-base"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            <form
              onSubmit={handleAddDoctor}
              className="bg-white/50 px-5 md:px-8 py-6 rounded-lg shadow-lg mb-10 w-96 md:w-[550px] mx-auto"
            >
              <h3 className="text-lg md:text-xl font-bold text-secondary/50 mb-6 text-center">
                Add New Doctor
              </h3>
              <div className="grid grid-cols-1 gap-3 md:gap-5">
                <div>
                  <label
                    htmlFor="image"
                    className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                  >
                    Image File
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleImageUpload(e, "new")}
                    className="w-full p-1.5 md:p-2 bg-white/80 border  rounded-lg text-sm md:text-base"
                    required
                  />
                  {newDoctor.imageSrc && (
                    <div className="flex justify-center my-1">
                      <img
                        src={newDoctor.imageSrc}
                        alt="Preview"
                        className="mt-3 w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={newDoctor.firstName}
                      onChange={(e) =>
                        setNewDoctor((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastname"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={newDoctor.lastName}
                      onChange={(e) =>
                        setNewDoctor((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="specialization"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Specialization
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      value={newDoctor.specialization}
                      onChange={(e) =>
                        setNewDoctor((prev) => ({
                          ...prev,
                          specialization: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter specialization"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="experienceYears"
                      className="block text-secondary font-semibold mb-1 md:mb-2 text-sm md:text-base"
                    >
                      Experience years
                    </label>
                    <input
                      type="number"
                      id="experienceYears"
                      value={newDoctor.experienceYears}
                      onChange={(e) =>
                        setNewDoctor((prev) => ({
                          ...prev,
                          experienceYears: e.target.value,
                        }))
                      }
                      className="w-full p-1.5 md:p-2 border rounded-lg text-sm md:text-base"
                      placeholder="Enter years of experience"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="rounded-lg btn font-semibold py-1.5 md:py-2 px-4 md:px-5 bg-primary/50 text-white text-sm md:text-base"
                >
                  Add Doctor
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="mb-6 bg-white p-5 rounded-xl shadow-lg flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <h4 className="text-lg font-bold text-dark">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h4>
                      <p className="text-secondary text-sm">
                        {doctor.specialization}
                      </p>
                      <p className="text-secondary text-sm">
                        {doctor.experienceYears} years of experience
                      </p>
                    </div>
                    <img
                      src={doctor.imageSrc}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      className="mt-3 bg-primary/50 text-white py-1.5 px-4 rounded-lg font-bold hover:bg-gray-500 transition duration-300 text-sm"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="mt-3 bg-primary/50 text-white py-1.5 px-4 rounded-lg font-bold hover:bg-gray-500 transition duration-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
