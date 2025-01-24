import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
  });

  const { login: setLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5098/api/Account/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            birthDate: formData.birthDate,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to register");
      else {
        alert("Registration successful! You can now log in.");
        setIsRegistering(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          birthDate: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5098/api/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        const decodedToken = jwtDecode(data.token);
        const roles =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setLoggedIn();
        if (roles.includes("Admin")) {
          navigate("/admin-page");
        } else {
          navigate("/");
        }
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          birthDate: "",
        });
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/login-background.jpg')",
      }}
    >
      <div
        className={`bg-white/20 shadow-xl rounded-xl px-5 max-w-lg w-full ${
          isRegistering ? "space-y-2 py-6" : "space-y-4 py-14"
        }`}
      >
        <h1
          className={`text-center text-white font-bold ${
            isRegistering ? "text-3xl mb-3" : "text-4xl mb-6"
          }`}
        >
          {isRegistering ? "Register" : "Login"}
        </h1>

        <form
          className={`space-y-${isRegistering ? "3" : "4"} `}
          onSubmit={isRegistering ? register : login}
        >
          <div>
            <label
              htmlFor="email"
              className={`block ${
                isRegistering ? "text-sm" : "text-base"
              } font-semibold text-blue-900 mb-1`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full ${
                isRegistering ? "p-1.5 text-sm" : "p-2 mb-2"
              } rounded-xl border-none bg-white/70 text-secondary`}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block ${
                isRegistering ? "text-sm" : "text-base"
              } font-semibold text-blue-900 mb-1`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full ${
                isRegistering ? "p-1.5 text-sm" : "p-2 mb-2"
              } rounded-xl border-none bg-white/70 text-secondary`}
              required
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold mb-1 text-blue-900"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-1.5 text-sm rounded-xl border-none bg-white/70 text-secondary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold mb-1 text-blue-900"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-1.5 text-sm rounded-xl border-none bg-white/70 text-secondary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold mb-1 text-blue-900"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-1.5 text-sm rounded-xl border-none bg-white/70 text-secondary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold mb-1 text-blue-900"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="e.g. 0712345678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-1.5 text-sm rounded-xl border-none bg-white/70 text-secondary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-semibold mb-1 text-blue-900"
                  >
                    Birth Date
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full p-1.5 text-sm rounded-xl border-none bg-white/70  text-gray/70"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`w-full btn bg-primary/60 hover:bg-primary/80 py-2 rounded-xl mt-2 ${
              isRegistering ? "text-sm" : ""
            }`}
          >
            {isRegistering ? "Register Now" : "Login"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-blue-900">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="font-bold underline"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={toggleForm}
                className="font-bold underline"
              >
                Register now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
