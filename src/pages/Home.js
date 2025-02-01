// src/pages/Home.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Nav from "../components/Nav";
import Upload from "../components/Upload";
import { TextProvider } from "../components/TextContext";
import UploadedSpeech from "../components/UploadedSpeech";
import { UserProvider } from "../components/UserContext"; // Import UserProvider
import { AuthContext } from "../components/AuthContext";
import Speech3 from "../components/Speech2 copy";

function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Add chatbot scripts
  useEffect(() => {
    // Add chatbot configuration script
    const scriptConfig = document.createElement("script");
    scriptConfig.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "igq99n023Iuwzyiy7d3fQ",
        domain: "www.chatbase.co"
      };
    `;
    document.body.appendChild(scriptConfig);

    // Add chatbot embed script
    const scriptEmbed = document.createElement("script");
    scriptEmbed.src = "https://www.chatbase.co/embed.min.js";
    scriptEmbed.setAttribute("chatbotId", "igq99n023Iuwzyiy7d3fQ");
    scriptEmbed.setAttribute("domain", "www.chatbase.co");
    scriptEmbed.defer = true;
    document.body.appendChild(scriptEmbed);

    // Cleanup scripts when component unmounts
    return () => {
      document.body.removeChild(scriptConfig);
      document.body.removeChild(scriptEmbed);
    };
  }, []);

  // Fetch user tier (assuming you intend to use it somewhere)
  const fetchUserTier = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/get-user-tier/${userId}`); // Changed port to 5000 to match backend
      console.log("User tier fetched:", response.data);
      setUserInfo(response.data); // Update state if needed
      return response.data;
    } catch (error) {
      console.error("Error fetching user tier:", error);
      throw error;
    }
  };

  // Optionally, fetch user tier when user data is available
  useEffect(() => {
    if (user && user._id) {
      fetchUserTier(user._id);
    }
  }, [user]);

  // Conditional rendering after all Hooks
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className="bg-black">
      <UserProvider> {/* Wrap everything with UserProvider */}
        <Nav />
        <TextProvider>
          <Speech3 />
          <Upload />
          <UploadedSpeech />
        </TextProvider>
      </UserProvider>
    </div>
  );
}

export default Home;
