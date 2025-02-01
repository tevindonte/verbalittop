import React, { useContext, useEffect, useState, useCallback } from "react";
import Board from "../components/board";
import Nav from "../components/NavMood";
import debounce from 'lodash.debounce';
import axios from "axios";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext
import ShareMoodboardModal from "../components/ShareMoodboardModal";

export default function Moodboard() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [folders, setFolders] = useState([]); // Folders list
  const { user, loading } = useContext(AuthContext); // Access user and loading state from AuthContext
  const userId = user?._id;
// Add chatbot scripts
useEffect(() => {
  // Add chatbot configuration script
  const scriptConfig = document.createElement("script");
  scriptConfig.innerHTML = `
    window.embeddedChatbotConfig = {
      chatbotId: "igq99n023Iuwzyiy7d3fQ",
      domain: "www.chatbase.co"
    };
  `;
  document.body.appendChild(scriptConfig);

  // Add chatbot embed script
  const scriptEmbed = document.createElement("script");
  scriptEmbed.src = "https://www.chatbase.co/embed.min.js";
  scriptEmbed.setAttribute("chatbotId", "igq99n023Iuwzyiy7d3fQ");
  scriptEmbed.setAttribute("domain", "www.chatbase.co");
  scriptEmbed.defer = true;
  document.body.appendChild(scriptEmbed);

  // Cleanup scripts when component unmounts
  return () => {
    document.body.removeChild(scriptConfig);
    document.body.removeChild(scriptEmbed);
  };
}, []);
  // Fetch boards and folders from the server on initial load
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`/api/boards/${userId}`);
        setBoards(response.data);
        if (response.data.length > 0) setActiveBoardId(response.data[0]._id); // Set active board if available
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    const fetchFolders = async () => {
      try {
        console.log("Fetching folders...");
        const response = await axios.get(`/api/users/${userId}/folders`);
        console.log("Folders fetched:", response.data);
        setFolders([{ _id: null, name: "No Folder" }, ...response.data]); // Add "No Folder" option
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    if (userId) {
      fetchBoards();
      fetchFolders();
    }
  }, [userId]);

  // Add a new board
  const addBoard = async () => {
    const newBoard = {
      name: `Board ${boards.length + 1}`,
      elements: [],
    };
    try {
      const response = await axios.post(`/api/boards/${userId}`, newBoard);
      setBoards((prev) => [...prev, response.data]);
      setActiveBoardId(response.data._id);
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  // Rename an existing board
  const renameBoard = async (id, newName) => {
    try {
      const response = await axios.put(`/api/boards/${userId}/${id}`, { name: newName });
      setBoards((prev) =>
        prev.map((board) =>
          board._id === id ? { ...board, name: response.data.name } : board
        )
      );
    } catch (error) {
      console.error("Error renaming board:", error);
    }
  };

  // Delete a board
  const deleteBoard = async (id) => {
    try {
      const response = await axios.delete(`/api/boards/${userId}/${id}`);
      console.log(response.data.message);
      setBoards((prev) => prev.filter((board) => board._id !== id));
      if (activeBoardId === id && boards.length > 1) {
        // Set to the first board in the list
        const remainingBoards = boards.filter((board) => board._id !== id);
        setActiveBoardId(remainingBoards[0]._id);
      } else if (boards.length === 1) {
        setActiveBoardId(null);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  // Debounced function to update board elements
  const updateActiveBoardElements = useCallback(
    debounce(async (updatedElements) => {
      if (!activeBoardId) {
        console.error("No active board selected.");
        return;
      }

      // Remove `_id` from elements to prevent conflicts
      const sanitizedElements = updatedElements.map(({ _id, ...rest }) => rest);

      try {
        const response = await axios.put(`/api/boards/${userId}/${activeBoardId}`, {
          elements: sanitizedElements,
        }); // Send only elements
        setBoards((prev) =>
          prev.map((board) =>
            board._id === activeBoardId ? response.data : board
          )
        );
      } catch (error) {
        console.error("Error updating board elements:", error);
      }
    }, 500), // 500ms debounce delay
    [userId, activeBoardId] // Dependencies
  );

  const activeBoard = boards.find((board) => board._id === activeBoardId);

  // Handler for folder selection (implements folder linkage)
  const handleFolderChange = async (boardId, folderId) => {
    try {
      // Make the PUT request to link the board to the selected folder
      const response = await axios.put(`/api/boards/${boardId}/link-folder`, {
        folderId: folderId || null, // Send null to unlink
      });

      // Update the local state to reflect the change
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === boardId ? { ...board, folderId: response.data.folderId } : board
        )
      );

      console.log(`Board ${boardId} successfully linked to folder ${folderId}`);
    } catch (error) {
      console.error("Error linking board to folder:", error);
      alert("Failed to link board to folder. Please try again.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-gray-300 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Boards</h2>
            <div className="flex space-x-2">
              {/* Updated Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="px-2 py-1 bg-green-500 text-white rounded"
                disabled={!activeBoardId}
                title={activeBoardId ? "Share Selected Moodboard" : "Select a Moodboard to Share"}
              >
                Share
              </button>

              <button
                onClick={addBoard}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
          <ul className="space-y-2">
            {boards.map((board) => (
              <li
                key={board._id}
                className={`p-2 rounded cursor-pointer ${activeBoardId === board._id ? "bg-gray-200" : ""
                  }`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span
                      onClick={() => setActiveBoardId(board._id)}
                      className="flex-1"
                    >
                      {board.name}
                    </span>
                    <button
                      onClick={() =>
                        renameBoard(
                          board._id,
                          prompt("Rename board:", board.name) || board.name
                        )
                      }
                      className="px-1 text-blue-500"
                      aria-label={`Rename ${board.name}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteBoard(board._id)}
                      className="px-1 text-red-500"
                      aria-label={`Delete ${board.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                  {/* Folder Dropdown */}
                  <select
                    value={board.folderId || ""}
                    onChange={(e) =>
                      handleFolderChange(
                        board._id,
                        e.target.value === "" ? null : e.target.value
                      )
                    }
                    className="mt-2 border rounded px-2 py-1"
                    aria-label={`Select folder for ${board.name}`}
                  >
                    {folders.map((folder) => (
                      <option key={folder._id || "no-folder"} value={folder._id || ""}>
                        {folder.name || "No Folder"}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Board Area */}
        <div className="flex-1">
          {activeBoard ? (
            <Board
              userId={userId} // Pass userId as a prop
              boardId={activeBoard._id} // Pass boardId as a prop
              elements={activeBoard.elements}
              updateElements={updateActiveBoardElements}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No boards available. Create a new one!</p>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareMoodboardModal
          moodboardId={activeBoardId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
