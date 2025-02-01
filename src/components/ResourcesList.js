import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";
import AudioRecorder from "./AudioRecorder";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext

export default function ResourcesList({ folderId, resources = [], role, onAddFile }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation to the notebook or moodboard page
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const userId = user?._id;

  // Remove onAddFile from dependency array so that the fetch function is stable
  const fetchResourcesAndMoodboards = useCallback(async () => {
    if (!folderId) {
      setError("Folder ID is missing.");
      return;
    }
    try {
      // Use Promise.allSettled to fetch resources, notebook pages, and moodboards
      const [resourceResult, pageResult, moodboardResult] = await Promise.allSettled([
        axios.get(`http://localhost:5000/api/folders/${folderId}/resources`),
        axios.get(`http://localhost:5000/api/notebook/pages/folder/${folderId}`),
        axios.get(`http://localhost:5000/api/folders/${folderId}/moodboards`), // Added moodboards API call
      ]);

      const fetchedResources =
        resourceResult.status === "fulfilled" ? resourceResult.value.data : [];
      const fetchedPages =
        pageResult.status === "fulfilled"
          ? pageResult.value.data.map((page) => ({
              _id: page._id,
              filename: page.name,
              contentType: "notebook/page", // Distinguish notebook pages
            }))
          : [];
      const fetchedMoodboards =
        moodboardResult.status === "fulfilled"
          ? moodboardResult.value.data.map((moodboard) => ({
              _id: moodboard._id,
              filename: moodboard.name,
              contentType: "moodboard", // Distinguish moodboards
              thumbnailUrl: moodboard.thumbnailUrl, // Ensure thumbnailUrl exists
            }))
          : [];

      // Combine resources, pages, and moodboards while removing duplicates
      const combinedResources = [
        ...fetchedResources,
        ...fetchedPages,
        ...fetchedMoodboards, // Include moodboards in the combined array
      ].reduce((acc, item) => {
        if (!acc.some((existing) => existing._id === item._id)) {
          acc.push(item);
        }
        return acc;
      }, []);

      // Call onAddFile to update the resources in the parent component
      if (onAddFile && typeof onAddFile === "function") {
        onAddFile(combinedResources);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch resources, pages, or moodboards.");
    }
  }, [folderId]); // Removed onAddFile from dependency list

  useEffect(() => {
    fetchResourcesAndMoodboards();
  }, [fetchResourcesAndMoodboards]);

  const handleDeleteFile = async (fileId) => {
    if (role !== "editor" && role !== "owner") {
      alert("You do not have permission to delete files.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/resources/${fileId}`);
      if (onAddFile && typeof onAddFile === "function") {
        onAddFile(resources.filter((resource) => resource._id !== fileId));
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file.");
    }
  };

  const renderPreview = (resource) => {
    if (!resource || !resource.contentType) {
      return null; // Skip rendering if resource or contentType is undefined
    }

    const previewUrl =
      resource.contentType === "notebook/page" || resource.contentType === "moodboard"
        ? null // Notebook pages and moodboards do not have a preview URL
        : `http://localhost:5000/api/folders/${folderId}/resources/${resource.filename}`;

    if (resource.contentType.startsWith("image")) {
      return (
        <img
          src={previewUrl}
          alt={resource.filename}
          className="h-32 w-32 object-cover rounded-lg"
        />
      );
    }

    if (resource.contentType.startsWith("audio")) {
      return (
        <audio controls className="w-full">
          <source src={previewUrl} type={resource.contentType} />
        </audio>
      );
    }

    if (resource.contentType.startsWith("video")) {
      return (
        <video controls className="h-32 w-32">
          <source src={previewUrl} type={resource.contentType} />
        </video>
      );
    }

    if (resource.contentType === "application/pdf") {
      return (
        <button
          onClick={() => window.open(previewUrl, "_blank")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          View PDF
        </button>
      );
    }

    if (resource.contentType === "notebook/page") {
      return (
        <div className="text-gray-700 text-sm">
          <p>Notebook Page: {resource.filename}</p>
          <button
            onClick={() => navigate(`/notebook/${resource._id}`)} // Navigate to the specific notebook page
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Open Page
          </button>
        </div>
      );
    }

    if (resource.contentType === "moodboard") {
      return (
        <div className="text-gray-700 text-sm">
          <img
            src={resource.thumbnailUrl || "/default-thumbnail.png"}
            alt={resource.filename}
            className="h-32 w-32 object-cover rounded-lg cursor-pointer"
            onClick={() => navigate(`/moodboard/`)}
          />
          <p className="mt-2">{resource.filename}</p>
        </div>
      );
    }

    return (
      <button
        onClick={() => window.open(previewUrl, "_blank")}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
      >
        Open {resource.filename.split(".").pop().toUpperCase()}
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Resources</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Only show FileUploader and AudioRecorder for owners and editors */}
      {(role === "editor" || role === "owner") && (
        <>
          <FileUploader folderId={folderId} onAddFile={onAddFile} />
          <AudioRecorder folderId={folderId} onAddFile={onAddFile} />
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.length > 0 ? (
          resources.map((resource, index) => (
            <div
              key={resource._id || index}  // Use resource._id if available, otherwise the index
              className="bg-white shadow rounded-lg p-4 flex flex-col items-center"
            >
              {renderPreview(resource)}
              {resource.contentType !== "moodboard" && (
                <p className="mt-2 text-sm text-gray-700 truncate w-full">
                  {resource.filename}
                </p>
              )}
              {(role === "editor" || role === "owner") &&
                resource.contentType !== "notebook/page" &&
                resource.contentType !== "moodboard" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        resource.contentType !== "notebook/page" &&
                        resource.contentType !== "moodboard" &&
                        window.open(
                          `http://localhost:5000/api/folders/${folderId}/resources/${resource.filename}`,
                          "_blank"
                        )
                      }
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteFile(resource._id)}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No resources or moodboards available.</p>
        )}
      </div>
    </div>
  );
}
