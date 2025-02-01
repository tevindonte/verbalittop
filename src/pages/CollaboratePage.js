import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../components/AuthContext";
import TextEditor from "../components/TextEditor copy";
import axios from "axios";
import NotebookShareModal from "../components/NotebookShareModal";

let socket;

export default function CollaborationPage() {
  const { pageId, token } = useParams();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [role, setRole] = useState("viewer");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const verifyTokenAndConnect = async () => {
      try {
        // Verify token and get role
        const verifyResponse = await axios.get(
          `http://localhost:5000/api/collab/verify-token/${token}`
        );
        setRole(verifyResponse.data.role);

        // Initialize Socket.IO
        socket = io("http://localhost:5000");
        socket.emit("joinPage", pageId);

        // Listen for content updates
        socket.on("contentUpdated", (newContent) => {
          setContent(newContent);
        });

        // Fetch initial content
        const contentResponse = await axios.get(
          `http://localhost:5000/api/notebook/pages/${pageId}`
        );
        setContent(contentResponse.data.content);

      } catch (error) {
        console.error("Collaboration setup error:", error);
        alert("Invalid or expired token.");
      }
    };

    if (pageId && token) verifyTokenAndConnect();

    return () => {
      if (socket) {
        socket.off("contentUpdated");
        socket.disconnect();
      }
    };
  }, [pageId, token]);

  const handleContentChange = (newContent) => {
    if (role === "viewer") return;
    
    setContent(newContent);
    socket.emit("updateContent", pageId, newContent);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Collaborating on Page: {pageId}</h1>
        {(role === "owner" || role === "editor") && (
          <button
            onClick={() => setShowShareModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Share Page
          </button>
        )}
      </div>

      <TextEditor
        content={content}
        onChange={handleContentChange}
        isEditable={role === "owner" || role === "editor"}
      />

      <p className="mt-2 text-sm text-gray-600">
        Your role: <strong>{role}</strong>
      </p>

      {showShareModal && (
        <NotebookShareModal
          pageId={pageId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}