import React, { useState } from "react";
import axios from "axios";

export default function FolderShareModal({ folderId, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [shareLink, setShareLink] = useState("");
  const [shareRole, setShareRole] = useState("viewer"); // New state for share link role

  const generateShareLink = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/folders/share`, {
        folderId,
        role: shareRole, // Pass the selected role
      });
      setShareLink(response.data.shareLink);
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Failed to generate share link.");
    }
  };

  const sendInvitation = async () => {
    try {
      await axios.post(`http://localhost:5000/api/folders/invite`, {
        folderId,
        email,
        role,
      });
      alert("Invitation sent successfully!");
      setEmail("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Failed to send invitation.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Share Folder</h2>
        <div className="mb-4">
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button onClick={generateShareLink} className="bg-blue-500 text-white px-4 py-2 rounded">
            Generate Share Link
          </button>
          {shareLink && (
            <div className="mt-2">
              <input type="text" value={shareLink} readOnly className="border p-2 w-full" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Invite Collaborator</h3>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button onClick={sendInvitation} className="bg-green-500 text-white px-4 py-2 rounded">
            Send Invitation
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-gray-500 underline">
          Close
        </button>
      </div>
    </div>
  );
}
