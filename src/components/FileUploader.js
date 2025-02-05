import React, { useState } from "react";
import axios from "axios";

export default function FileUploader({ folderId, onAddFile }) {
  const [fileData, setFileData] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // For upload feedback

  const supportedTypes = [
    "application/pdf", "text/plain", "image/jpeg", "image/png",
    "audio/webm", "audio/mpeg", "video/mp4",
  ]; // Add all supported MIME types here

  const handleFileUpload = async () => {
    if (!fileData) {
      alert("Please select a file to upload.");
      return;
    }

    if (!folderId) {
      alert("Folder ID is missing. Cannot upload the file.");
      return;
    }

    // Optional: Client-side file type validation
    if (!supportedTypes.includes(fileData.type)) {
      alert("Unsupported file type. Please select a valid file.");
      return;
    }

    setIsUploading(true); // Show upload in progress

    try {
      const formData = new FormData();
      formData.append("file", fileData); // Match "file" with backend field
      formData.append("folderId", folderId); // Pass folderId explicitly if needed

      // Make POST request to upload endpoint
      const response = await axios.post(`https://verbalitserver.onrender.com/gridfs-upload/${folderId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Uploaded file:", response.data);
      onAddFile(response.data.file); // Update parent component with the uploaded file
      setFileData(null); // Reset file input
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error.response?.data?.message || "Failed to upload file.");
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        onChange={(e) => setFileData(e.target.files[0])}
        className="border border-gray-300 rounded-md p-2 mb-2"
      />
      <button
        onClick={handleFileUpload}
        disabled={isUploading}
        className={`px-4 py-2 rounded-md ${isUploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"} text-white`}
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}
