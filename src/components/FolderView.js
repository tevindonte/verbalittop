// FolderView.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import AudioRecorder from "../components/AudioRecorder";
import ShareModal from "../components/ShareModal";
import Nav from "../components/NavProject";

export default function FolderView() {
  const { folderId } = useParams(); // Extract folderId from URL
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Debugging: Log the folderId
  console.log("Folder ID from URL:", folderId);

  useEffect(() => {
    const fetchFolder = async () => {
      if (!folderId) {
        console.error("No folderId provided in URL.");
        return;
      }

      console.log(`Fetching folder with ID: ${folderId}`);

      try {
        const response = await axios.get(`/api/folders/${folderId}`);
        setFolder(response.data);
        console.log("Fetched folder data:", response.data);
      } catch (error) {
        console.error("Error fetching folder data:", error);
        alert(error.response?.data?.message || "Failed to fetch folder.");
      }
    };

    fetchFolder();
  }, [folderId]);

  const addFileToFolder = (file) => {
    if (!folder) return;
    const updatedFiles = [...folder.files, file];
    setFolder({ ...folder, files: updatedFiles });
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`/api/folders/${folderId}/files/${fileId}`);
      setFolder({
        ...folder,
        files: folder.files.filter((file) => file._id !== fileId),
      });
      console.log(`Deleted file with ID: ${fileId}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(error.response?.data?.message || "Failed to delete file.");
    }
  };

  const deleteFolder = async () => {
    try {
      await axios.delete(`/api/folders/${folderId}`);
      alert("Folder deleted successfully.");
      console.log(`Deleted folder with ID: ${folderId}`);
      // Redirect to home or another page after deletion
      navigate("/");
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert(error.response?.data?.message || "Failed to delete folder.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen bg-gray-100 p-6">
        {folder ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Folder: {folder.name}</h1>
              <button
                onClick={deleteFolder}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete Folder
              </button>
            </div>

            {/* File uploader and audio recorder */}
            <div className="space-y-6">
              <FileUploader
                folderId={folder._id}
                files={folder.files}
                onAddFile={addFileToFolder}
                onDeleteFile={deleteFile}
              />
              <AudioRecorder onSave={(audio) => addFileToFolder(audio)} />
            </div>
          </>
        ) : (
          <p>Loading folder data...</p>
        )}
      </div>

      {showShareModal && folder && (
        <ShareModal
          folderId={folder._id}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
