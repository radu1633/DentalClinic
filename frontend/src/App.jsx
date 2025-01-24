import React from "react";
//import Navbar from "./components/Navbar/navbar";
import Hero from "./components/Hero/hero";
import About from "./components/About/About";
import Services from "./components/Servicess/Services";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import ServicesPage from "./components/Servicess/ServicesPage";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";
import Doctors from "./components/Doctors/Doctors";
import Profile from "./components/Profile/Profile";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import Booking from "./components/Booking/Bookings";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="overflow-x-hidden">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <About />
                  <Doctors />
                  <Services />
                </>
              }
            />
            <Route path="/services-page" element={<ServicesPage />} />
            <Route path="/login-page" element={<Login />} />
            <Route path="/admin-page" element={<Admin />} />
            <Route path="/profile-page" element={<Profile />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
