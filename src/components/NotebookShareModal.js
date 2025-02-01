import React, { useState } from "react";
import axios from "axios";

export default function NotebookShareModal({ pageId, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [shareLink, setShareLink] = useState("");
  const [shareRole, setShareRole] = useState("viewer");

  const generateShareLink = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/collab/share-page/${pageId}`,
        { role: shareRole }
      );
      setShareLink(response.data.shareLink);
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Failed to generate share link.");
    }
  };

  const sendInvitation = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/collab/invite-page/${pageId}`,
        { email, role }
      );
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
        <h2 className="text-lg font-bold mb-4">Share Notebook Page</h2>
        
        {/* Share Link Section */}
        <div className="mb-4">
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button 
            onClick={generateShareLink}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Generate Share Link
          </button>
          {shareLink && (
            <div className="mt-2">
              <input 
                type="text" 
                value={shareLink} 
                readOnly 
                className="border p-2 w-full text-sm" 
                onClick={(e) => e.target.select()}
              />
            </div>
          )}
        </div>

        {/* Email Invite Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Invite by Email</h3>
          <input
            type="email"
            placeholder="Enter collaborator's email"
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
          <button 
            onClick={sendInvitation}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Send Invitation
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 float-right"
        >
          Close
        </button>
      </div>
    </div>
  );
}