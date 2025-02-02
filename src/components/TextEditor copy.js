// TextEditor.js
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext
import { jsPDF } from "jspdf"; // Import jsPDF
import { io } from "socket.io-client"; // Import Socket.IO client

const TextEditor = ({ content, onChange, pageId }) => {
  const [text, setText] = useState(content || "");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const socketRef = useRef(null); // Socket reference

  const { user, loading } = useContext(AuthContext); // Access user and loading state from AuthContext

  const userId = user?._id;

  // Initialize Socket.IO connection and set up event listeners
  useEffect(() => {
    // Initialize Socket.IO client
    socketRef.current = io("https://verbalitserver.onrender.com"); // Update with your backend URL if different

    // Join the specific room based on pageId
    if (pageId) {
      socketRef.current.emit("joinPage", pageId);
    }

    // Listen for content changes from other collaborators
    socketRef.current.on("contentChange", ({ pageId: incomingPageId, newContent, senderId }) => {
      // Ensure the update is for the current page and not from the same user
      if (incomingPageId === pageId && senderId !== userId) {
        setText(newContent);
        onChange(newContent);
      }
    });

    // Optional: Listen for user join/leave events
    socketRef.current.on("userJoined", (user) => {
      console.log(`User ${user.username} joined the page.`);
    });

    socketRef.current.on("userLeft", (user) => {
      console.log(`User ${user.username} left the page.`);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [pageId, onChange, userId]);

  // Update local text when 'content' prop changes
  useEffect(() => {
    setText(content || "");
  }, [content]);

  // Function to emit content changes to other collaborators
  const emitContentChange = (newContent) => {
    if (socketRef.current && pageId) {
      socketRef.current.emit("contentChange", {
        pageId,
        newContent,
        senderId: userId, // Send the sender's user ID
      });
    }
  };

  // Handle local text changes
  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    onChange(newText);
    emitContentChange(newText);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await uploadAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("userId", userId);
    formData.append("pageId", pageId); // Optionally send pageId to associate transcription

    try {
      const response = await axios.post("https://verbalitserver.onrender.com/api/speech-to-text", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const transcribedText = response.data.transcription;
      if (transcribedText) {
        const updatedText = text + " " + transcribedText;
        setText(updatedText);
        onChange(updatedText);
        emitContentChange(updatedText); // Emit the transcribed text to collaborators
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Function to save text as PDF
  const saveAsPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180); // Adjust width as needed
    doc.text(lines, 10, 10);
    doc.save("document.pdf");
  };

  return (
    <div className="relative h-full">
      {/* Existing Textarea */}
      <textarea
        value={text}
        onChange={handleTextChange}
        className="w-full h-full p-6 text-lg font-sans bg-white border-none outline-none focus:outline-none focus:ring-0 resize-none"
        placeholder="Start typing or speak to transcribe..."
      />

      {/* Speak/Stop Recording Button */}
      <button
        onClick={toggleRecording}
        className={`absolute top-4 right-4 px-4 py-2 rounded shadow-lg transition-colors duration-300 ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white flex items-center`}
        aria-pressed={isRecording}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? "Stop" : "Speak"}
      </button>

      {/* Save as PDF Button */}
      <button
        onClick={saveAsPDF}
        className="absolute top-20 right-4 px-4 py-2 rounded shadow-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center transition-colors duration-300"
        aria-label="Save as PDF"
      >
        Save as PDF
      </button>
    </div>
  );
};

export default TextEditor;
