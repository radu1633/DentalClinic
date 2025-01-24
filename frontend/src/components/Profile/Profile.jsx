import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { logout, getRole } = useAuth();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [appointments, setAppointments] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [editInfo, setEditInfo] = useState({ ...userInfo });

  useEffect(() => {
    if (getRole() == "Admin") {
      navigate("/admin-page");
    } else if (getRole() == "") {
      navigate("/");
    } else {
      fetchUserInfo();
      fetchAppointments();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5098/api/Account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editInfo.firstName,
          lastName: editInfo.lastName,
          mail: editInfo.email,
          phoneNumber: editInfo.phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed!");
      }

      if (response.ok) {
        setUserInfo({ ...editInfo });
      } else {
        alert("The information couldn't be edited!");
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error("Error", error);
      alert("Failed to edit information. Please try again later.");
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditInfo({ ...userInfo });
    setIsEditing(false);
  };

  const navigate = useNavigate();

  const fetchUserInfo = async () => {
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

      if (!response.ok) throw new Error("Failed to fetch user information.");

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
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5098/api/Appointment`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch appointments.");

      const data = await response.json();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to fetch appointments. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200/50 ">
      <div className="max-w-4xl w-full bg-blue-200/70 rounded-lg shadow-lg overflow-hidden md:h-[500px]">
        <div className="flex flex-col md:flex-row">
          <div className=" md:w-1/3 p-6 pr-0 flex flex-col items-center md:h-[500px] bg-blue-200">
            <img
              src="/images/user-profile-picture.png"
              alt="user profile picture"
              className="w-28 h-28 rounded-full md:mt-2 mb-4 md:mb-8"
            />
            <h2 className="text-secondary/80 text-xl lg:text-2xl font-bold">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            <button
              onClick={() => {
                setEditInfo({ ...userInfo });
                setIsEditing(true);
              }}
              className="mt-8 md:mt-32 text-white/70 hover:text-white bg-primary/30 px-4 py-2 rounded-full hover:bg-primary/50 transition duration-300"
            >
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
          </div>
          <div className="md:w-2/3 px-5 py-8">
            <h3 className="md:text-xl font-semibold text-secondary mb-5">
              Information
            </h3>
            <div className="grid grid-cols-2 gap-6 mb-6 md:mb-10">
              <div>
                <p className="text-sm md:text-base font-semibold text-secondary">
                  Email
                </p>
                <p className="text-gray-500 text-sm md:text-base">
                  {userInfo.email}
                </p>
              </div>
              <div>
                <p className="text-sm md:text-base font-semibold text-secondary">
                  Phone number
                </p>
                <p className="text-gray-500 text-sm md:text-base">
                  {userInfo.phone}
                </p>
              </div>
            </div>
            <h3 className="md:text-xl font-semibold text-secondary mb-4">
              Appointments History
            </h3>
            <div className=" overflow-y-auto h-40 rounded-lg p-4 bg-white/50 ">
              <ul className="space-y-2">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="text-xs md:text-sm text-gray-500 border-b pb-2 last:border-b-0"
                  >
                    <p>
                      {appointment.serviceName} - {appointment.date} at{" "}
                      {appointment.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-4 ">
              <button
                onClick={logout}
                className="px-3 py-1.5 mt-5 md:mt-2 bg-primary/50 text-white font-semibold rounded-xl hover:bg-primary/70 transition"
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-blue-50/50 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">
              Edit Profile
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 ">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editInfo.firstName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editInfo.lastName}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editInfo.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={editInfo.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </form>
            <div className="flex justify-between mt-6 space-x-2">
              <button
                onClick={handleCancel}
                className="btn px-4 py-2 bg-primary/50 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn px-4 py-2 bg-primary/50  text-white rounded-lg hover:bg-gray-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
