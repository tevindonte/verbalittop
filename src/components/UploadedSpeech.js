import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useText } from "./TextContext";
import { AuthContext } from "../components/AuthContext";

const UploadedSpeech = () => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const { setText } = useText();
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const userId = user?._id; // Get userId from the authenticated user

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`https://verbalitserver.onrender.com/get-files?userId=${userId}`); // Include userId in the request
      console.log("Fetched submissions:", response.data.data);
      setSubmissions(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to fetch submissions.");
    }
  };

  const handlePlay = async (submission) => {
    if (submission.type === "upload") {
      try {
        const response = await axios.get(`https://verbalitserver.onrender.com/api/get-text/${submission._id}?userId=${userId}`); // Include userId in the request
        const { text } = response.data;

        console.log("Fetched text from backend:", text); // Log the fetched text

        if (text) {
          setText(text);
          alert("PDF text loaded into the input field!");
        } else {
          alert("No text found for this PDF.");
        }
      } catch (error) {
        console.error("Error fetching PDF text:", error);
        setError("Failed to fetch PDF text.");
      }
    } else {
      setText(submission.text);
    }
  };

  const deleteSubmission = async (id) => {
    try {
      await axios.delete(`/api/delete-file/${id}?userId=${userId}`); // Include userId in the request
      setSubmissions((prev) => prev.filter((submission) => submission._id !== id));
    } catch (error) {
      console.error("Error deleting submission:", error);
      setError("Failed to delete submission.");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [userId]); // Refetch submissions when userId changes

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
      {error && <p className="text-red-500">{error}</p>}
      {submissions.length === 0 && !error && (
        <p className="text-gray-500">No submissions found.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {submissions.map((submission) => (
          <div
            key={submission._id}
            className="p-4 bg-white rounded-lg shadow-lg border"
          >
            <h3 className="text-lg font-semibold">
              {submission.type === "upload" ? submission.pdf : "Pasted Text"}
            </h3>
            <p className="text-sm text-gray-600">
              {submission.text?.substring(0, 100) || "No preview available"}
            </p>
            {submission.type === "upload" && (
              <a
                href={`/files/${submission.pdf}`}
                download={submission.pdf}
                className="block mt-2 text-blue-500 hover:underline"
              >
                Download PDF
              </a>
            )}
            <button
              onClick={() => handlePlay(submission)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Play Text
            </button>
            <button
              onClick={() => deleteSubmission(submission._id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedSpeech;