// pages/SharedPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TextEditor from "../components/TextEditor";
import io from "socket.io-client";

let socket;

const SharedPage = () => {
  const { pageId, token } = useParams();
  const [page, setPage] = useState(null);
  const [role, setRole] = useState("viewer");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const fetchPageAccess = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/share/access/${pageId}/${token}`);
        if (response.data.accessType === "link") {
          setRole(response.data.role);
          setIsAuthorized(true);
        } else if (response.data.accessType === "invitation") {
          // Redirect to accept invitation page
          window.location.href = `/accept-invite/${pageId}/${token}`;
        }
      } catch (error) {
        console.error("Access verification failed:", error);
        alert("Invalid or expired share link.");
        window.location.href = "/";
      }
    };

    fetchPageAccess();
  }, [pageId, token]);

  useEffect(() => {
    if (isAuthorized) {
      // Initialize Socket.IO connection
      socket = io("http://localhost:5000");

      socket.emit("joinPage", { pageId, token });

      socket.on("pageEdited", (newContent) => {
        setPage((prevPage) => ({ ...prevPage, content: newContent }));
      });

      setSocketConnected(true);

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthorized, pageId, token]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notebook/pages/${pageId}`);
        setPage(response.data);
      } catch (error) {
        console.error("Error fetching shared page:", error);
      }
    };

    if (isAuthorized) {
      fetchPage();
    }
  }, [isAuthorized, pageId]);

  const handleUpdateContent = (content) => {
    setPage((prevPage) => ({ ...prevPage, content }));
    if (role === "editor" && socketConnected) {
      socket.emit("editPage", { pageId, content });
    }
  };

  if (!isAuthorized) {
    return <div>Authorizing...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Shared Notebook Page</h1>
      {page && (
        <TextEditor
          content={page.content}
          onChange={handleUpdateContent}
          readOnly={role === "viewer"}
        />
      )}
    </div>
  );
};

export default SharedPage;
