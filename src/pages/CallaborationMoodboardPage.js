// Example CollaborationMoodboardPage.js

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Board from "../components/board";

export default function CollaborationMoodboardPage() {
  const { moodboardId, token } = useParams();
  const [moodboard, setMoodboard] = useState(null);
  const [role, setRole] = useState("viewer");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // 1) Verify token & fetch moodboard
  useEffect(() => {
    if (!moodboardId || !token) {
      setErrorMessage("Invalid URL parameters.");
      setLoading(false);
      return;
    }

    const verifyAndFetch = async () => {
      try {
        // Verify token
        const verifyResp = await axios.get(
          `https://verbalitserver.onrender.com/api/moodboards/collaborate/${moodboardId}/${token}`
        );
        setRole(verifyResp.data.role || "viewer");

        // Fetch moodboard
        const boardResp = await axios.get(
          `https://verbalitserver.onrender.com/api/moodboards/${moodboardId}`
        );
        setMoodboard(boardResp.data);
      } catch (err) {
        console.error("Verify/fetch error:", err.message);
        setErrorMessage(
          err.response?.data?.message || "Invalid or expired token."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetch();
  }, [moodboardId, token]);

  // 2) Initialize Socket.IO AFTER we have moodboard & role (and no error).
  useEffect(() => {
    if (!loading && !errorMessage && moodboardId && token && moodboard) {
      const socket = io("https://verbalitserver.onrender.com", {
        transports: ["websocket"],
      });
      socketRef.current = socket;

      // Join the moodboard
      socketRef.current.emit("joinMoodboard", { boardId: moodboardId, token });

      socketRef.current.on("joined", ({ role }) => {
        console.log("Joined as role:", role);
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        setSocketConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setSocketConnected(false);
      });

      socketRef.current.on("contentUpdated", (updatedElements) => {
        // Another collaborator updated the board
        console.log("Received contentUpdated:", updatedElements);
        setMoodboard((prev) => ({ ...prev, elements: updatedElements }));
      });

      // Capture server-side errors
      socketRef.current.on("error", (msg) => {
        console.error("Socket error:", msg);
        setErrorMessage(msg);
      });

      return () => {
        // Clean up the socket on unmount
        socketRef.current?.disconnect();
        socketRef.current = null;
      };
    }
  }, [loading, errorMessage, moodboardId, token, moodboard]);

  // 3) Handler for updating board elements
  const handleUpdateElements = (updatedElements) => {
    setMoodboard((prev) => ({ ...prev, elements: updatedElements }));
    // Only send if editor & socket is connected
    if (role === "editor" && socketConnected && socketRef.current) {
      socketRef.current.emit("updateMoodboard", moodboardId, updatedElements);
    }
  };

  // 4) Render states
  if (loading) {
    return <div>Loading moodboard...</div>;
  }
  if (errorMessage) {
    return <div className="text-red-500">Error: {errorMessage}</div>;
  }
  if (!moodboard) {
    return <div className="text-red-500">No moodboard found</div>;
  }

  return (
    <div>
      <h2>{moodboard.name}</h2>
      <p>Role: {role}</p>
      <Board
        boardId={moodboardId}
        elements={moodboard.elements}
        updateElements={handleUpdateElements}
        readOnly={role === "viewer"}  // <--- important
      />
    </div>
  );
}
