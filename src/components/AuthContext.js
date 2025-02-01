// src/components/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "./axiosInstance"; // Ensure axiosInstance is correctly configured
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds authenticated user data
  const [loading, setLoading] = useState(true); // Indicates if the auth check is in progress

  // Function to fetch authenticated user info
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token"); // Adjust based on where you store the token

      if (token) {
        // If token exists, set the Authorization header
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axiosInstance.get("/api/auth/me");

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
          delete axiosInstance.defaults.headers.common["Authorization"];
        }
      } else {
        // No token found, ensure Authorization header is removed
        delete axiosInstance.defaults.headers.common["Authorization"];
        setUser(null);
      }
    } catch (error) {
      if (error.response && error.response.status !== 401) {
        // Log only unexpected errors
        console.error("AuthContext fetchUser error:", error);
        toast.error("An unexpected error occurred while fetching user data.");
      }
      setUser(null);
      delete axiosInstance.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false); // Authentication check is complete
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};





/*
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch authenticated user info
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("AuthContext fetchUser error:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
*/