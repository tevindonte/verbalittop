// src/components/ShareMoodboardModal.js
import React, { useState } from "react";
import axios from "axios";

export default function ShareMoodboardModal({ moodboardId, onClose }) {
  const [shareLink, setShareLink] = useState("");
  const [shareRole, setShareRole] = useState("viewer"); // Role for the share link
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer"); // Role for email invites

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate a share link with the chosen role
  const generateShareLink = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `http://localhost:5000/api/moodboards/${moodboardId}/share`,
        { role: shareRole } // Include role in request body
      );
      setShareLink(response.data.shareLink);
      setMessage("Share link generated successfully!");
    } catch (error) {
      console.error("Error generating share link:", error.response?.data || error.message);
      setMessage("Failed to generate share link.");
    } finally {
      setLoading(false);
    }
  };

  // Send an invitation email with the chosen role
  const sendInvitation = async () => {
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await axios.post(`http://localhost:5000/api/moodboards/${moodboardId}/invite`, {
        email,
        role: inviteRole,
      });
      setMessage("Invitation sent successfully!");
      setEmail("");
      setInviteRole("viewer");
    } catch (error) {
      console.error("Error sending invitation:", error.response?.data || error.message);
      setMessage("Failed to send invitation.");
    } finally {
      setLoading(false);
    }
  };

  // Copy the generated share link to clipboard
  const copyShareLink = () => {
    if (!shareLink) return;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setMessage("Share link copied to clipboard!");
      })
      .catch(() => {
        setMessage("Failed to copy share link.");
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close Modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">Share Moodboard</h2>

        {/* Generate Share Link Section */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold">Share Link Role</label>
          <select
            value={shareRole}
            onChange={(e) => setShareRole(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            onClick={generateShareLink}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Share Link"}
          </button>
          {shareLink && (
            <div className="mt-4 flex">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="border p-2 w-full rounded-l-md"
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={copyShareLink}
                className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600"
                aria-label="Copy Share Link"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Invite via Email Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Invite Collaborator via Email</h3>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
            required
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
          <button
            onClick={sendInvitation}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
