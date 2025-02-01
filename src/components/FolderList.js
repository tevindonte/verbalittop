import React from "react";
import { useNavigate } from "react-router-dom";

export default function FolderList({ folders, deleteFolder, selectFolder, onShareFolder }) {
  const navigate = useNavigate();
  
  const handleDelete = (folder) => {
    deleteFolder(folder._id); // Pass the folder ID to delete
  };
  
  const handleSelectFolder = (folder) => {
    selectFolder(folder);
    navigate(`/folder/${folder._id}`); // Navigate using folder ID
  };

  return (
    <div>
      <ul className="mt-4 space-y-2">
        {folders.map((folder) => (
          <li key={folder._id} className="flex justify-between items-center">
            <button
              onClick={() => handleSelectFolder(folder)}
              className="text-blue-500 underline"
            >
              {folder.name}
            </button>
            <button
              onClick={() => handleDelete(folder)}
              className="text-red-500"
            >
              Delete
            </button>
            <button
              onClick={() => onShareFolder(folder)}
              className="text-green-500 hover:text-green-700"
            >
              Share
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
