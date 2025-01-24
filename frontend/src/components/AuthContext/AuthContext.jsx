import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5098/api/Account/user/me",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setIsLoggedIn(true);
            setUser(userData);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const getRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const roles =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      return roles.includes("Admin") ? "Admin" : "User";
    }
    return "";
  };

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    const roles =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
    setRole(roles.includes("Admin") ? "Admin" : "User");
  };

  const logout = async (e) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5098/api/Account/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
      } else {
        console.error("Failed to log out");
        alert("An error occurred while logging out. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
