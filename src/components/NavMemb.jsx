// src/components/Nav.jsx
import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai/index";

import { useNavigate, Link } from "react-router-dom"; // Use Link for client-side routing
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance"; // Import the centralized Axios instance

export default function Nav() {
  const [userInfo, setUserInfo] = useState(null);
  const [nav, setNav] = useState(true); // Mobile menu toggle
  const navigate = useNavigate();

  // Function to fetch user data from backend
  const getUserData = async () => {
    try {
      // Make a GET request to /api/auth/me with credentials to include cookies
      const response = await axiosInstance.get("/api/auth/me");

      if (response.data.success) {
        setUserInfo(response.data.user); // Adjust based on backend response structure
      } else {
        // If not successful, handle accordingly
        toast.error(response.data.message || "Failed to fetch user info.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please log in again.");
      navigate("/login"); // Redirect to login on failure
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures it runs once

  // Toggle mobile navigation menu
  const handleNav = () => {
    setNav(!nav);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      toast.success("Logged out successfully");
      setUserInfo(null); // Clear user info
      navigate("/login"); // Redirect to login page
      window.location.reload(); // Force full page reload
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="text-black bg-white font-SecularOne text-sm flex justify-between items-center h-24 max-w-[1440px] mx-auto px-4">
      {/* Logo */}
      <Link to="/">
        <img
          src={require("../verbalitlogo/whitelogo.png")}
          alt="Logo"
          width="55"
          height="55"
        />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center space-x-8">
        <li>
          <Link to="/" className="hover:text-yellow-400 transition-colors">
            Verbal
          </Link>
        </li>
        <li>
          <Link to="/moodboard" className="hover:text-yellow-400 transition-colors">
            Moodboard
          </Link>
        </li>
        <li>
          <Link to="/notebook" className="hover:text-yellow-400 transition-colors">
            Notebook
          </Link>
        </li>
        <li>
          <Link to="/Calendar" className="hover:text-yellow-400 transition-colors">
            Calendar
          </Link>
        </li>
        <li>
          <Link to="/Projects" className="hover:text-yellow-400 transition-colors">
            Project
          </Link>
        </li>
        <div className="flex items-center space-x-4">
          <Link to="/membership">
            <h1 className="text-black">Plans</h1>
          </Link>
          <h1 className="text-black">{userInfo?.name}</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="text-black border border-yellow-500 bg-gradient-to-br from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Sign Out
          </button>
        </div>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {!nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          !nav ? "left-0" : "left-[-100%]"
        } fixed top-0 w-[60%] h-full border-r border-gray-900 bg-[#080606] ease-in-out duration-500`}
      >
        <img
          src={require("../verbalitlogo/VictoryPath.png")}
          alt="Logo"
          width="140"
          height="140"
          className="mx-auto my-4"
        />
        <ul className="space-y-4 p-4">
          <li>
            <Link
              to="/moodboard"
              className="text-white hover:text-yellow-400 transition-colors"
              onClick={handleNav}
            >
              Moodboard
            </Link>
          </li>
          <li>
            <Link
              to="/notebook"
              className="text-white hover:text-yellow-400 transition-colors"
              onClick={handleNav}
            >
              Notebook
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className="text-white hover:text-yellow-400 transition-colors"
              onClick={handleNav}
            >
              Goals
            </Link>
          </li>
          <div className="flex flex-col space-y-2 items-start">
            <h1 className="text-white">{userInfo?.name}</h1>
            <h1 className="text-white">{userInfo?.email}</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="text-black border border-yellow-500 bg-gradient-to-br from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Sign Out
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}
