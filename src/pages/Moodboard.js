import React, { useContext, useEffect, useState, useCallback } from "react";
import Board from "../components/board";
import Nav from "../components/NavMood";
import debounce from "lodash.debounce";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import ShareMoodboardModal from "../components/ShareMoodboardModal";

export default function Moodboard() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  // -------------------------------
  // States for Pinterest Panel
  // -------------------------------
  const [showPinterestPanel, setShowPinterestPanel] = useState(false);
  const [pinterestUrl, setPinterestUrl] = useState("");
  const [embedType, setEmbedType] = useState("board");

  // -------------------------------
  // 1) Load Chatbot Scripts
  // -------------------------------
  useEffect(() => {
    const scriptConfig = document.createElement("script");
    scriptConfig.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "igq99n023Iuwzyiy7d3fQ",
        domain: "www.chatbase.co"
      };
    `;
    document.body.appendChild(scriptConfig);

    const scriptEmbed = document.createElement("script");
    scriptEmbed.src = "https://www.chatbase.co/embed.min.js";
    scriptEmbed.setAttribute("chatbotId", "igq99n023Iuwzyiy7d3fQ");
    scriptEmbed.setAttribute("domain", "www.chatbase.co");
    scriptEmbed.defer = true;
    document.body.appendChild(scriptEmbed);

    return () => {
      document.body.removeChild(scriptConfig);
      document.body.removeChild(scriptEmbed);
    };
  }, []);

  // -------------------------------
  // 2) Load Pinterest Script Once
  // -------------------------------
  useEffect(() => {
    if (!document.querySelector('script[src="//assets.pinterest.com/js/pinit.js"]')) {
      const script = document.createElement("script");
      script.src = "//assets.pinterest.com/js/pinit.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.PinUtils) {
          window.PinUtils.build();
        }
      };
    }
  }, []);

  // -------------------------------
  // 3) Re-build Pinterest Embed on URL or Panel Toggle or Embed Type
  // -------------------------------
  useEffect(() => {
    if (showPinterestPanel && pinterestUrl && window.PinUtils) {
      window.PinUtils.build();
    }
  }, [showPinterestPanel, pinterestUrl, embedType]);

  // -------------------------------
  // 4) Fetch Boards and Folders
  // -------------------------------
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `https://verbalitserver.onrender.com/api/boards/${userId}`
        );
        setBoards(response.data);
        if (response.data.length > 0) setActiveBoardId(response.data[0]._id);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    const fetchFolders = async () => {
      try {
        console.log("Fetching folders...");
        const response = await axios.get(
          `https://verbalitserver.onrender.com/api/users/${userId}/folders`
        );
        console.log("Folders fetched:", response.data);
        setFolders([{ _id: null, name: "No Folder" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    if (userId) {
      fetchBoards();
      fetchFolders();
    }
  }, [userId]);

  // -------------------------------
  // 5) Board Management (Add, Rename, Delete)
  // -------------------------------
  const addBoard = async () => {
    const newBoard = {
      name: `Board ${boards.length + 1}`,
      elements: [],
    };
    try {
      const response = await axios.post(
        `https://verbalitserver.onrender.com/api/boards/${userId}`,
        newBoard
      );
      setBoards((prev) => [...prev, response.data]);
      setActiveBoardId(response.data._id);
    } catch (error) {
      console.error("Error adding board:", error);
    }
  };

  const renameBoard = async (id, newName) => {
    try {
      const response = await axios.put(
        `https://verbalitserver.onrender.com/api/boards/${userId}/${id}`,
        { name: newName }
      );
      setBoards((prev) =>
        prev.map((board) =>
          board._id === id ? { ...board, name: response.data.name } : board
        )
      );
    } catch (error) {
      console.error("Error renaming board:", error);
    }
  };

  const deleteBoard = async (id) => {
    try {
      const response = await axios.delete(
        `https://verbalitserver.onrender.com/api/boards/${userId}/${id}`
      );
      console.log(response.data.message);
      setBoards((prev) => prev.filter((board) => board._id !== id));
      if (activeBoardId === id && boards.length > 1) {
        const remainingBoards = boards.filter((board) => board._id !== id);
        setActiveBoardId(remainingBoards[0]._id);
      } else if (boards.length === 1) {
        setActiveBoardId(null);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  // -------------------------------
  // 6) Update Board Elements (Debounced)
  // -------------------------------
  const updateActiveBoardElements = useCallback(
    debounce(async (updatedElements) => {
      if (!activeBoardId) {
        console.error("No active board selected.");
        return;
      }
      const sanitizedElements = updatedElements.map(({ _id, ...rest }) => rest);
      try {
        const response = await axios.put(
          `https://verbalitserver.onrender.com/api/boards/${userId}/${activeBoardId}`,
          {
            elements: sanitizedElements,
          }
        );
        setBoards((prev) =>
          prev.map((board) =>
            board._id === activeBoardId ? response.data : board
          )
        );
      } catch (error) {
        console.error("Error updating board elements:", error);
      }
    }, 500),
    [userId, activeBoardId]
  );

  // -------------------------------
  // 7) Active Board + Folder Linking
  // -------------------------------
  const activeBoard = boards.find((board) => board._id === activeBoardId);

  const handleFolderChange = async (boardId, folderId) => {
    try {
      const response = await axios.put(
        `https://verbalitserver.onrender.com/api/boards/${boardId}/link-folder`,
        {
          folderId: folderId || null,
        }
      );
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === boardId
            ? { ...board, folderId: response.data.folderId }
            : board
        )
      );
      console.log(`Board ${boardId} successfully linked to folder ${folderId}`);
    } catch (error) {
      console.error("Error linking board to folder:", error);
      alert("Failed to link board to folder. Please try again.");
    }
  };

  // -------------------------------
  // 8) Render
  // -------------------------------
  return (
    <div>
      <Nav />
      {/* The container below is set to the full viewport height minus the nav's height (assumed 64px) */}
      <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
        {/* =============== LEFT SIDEBAR =============== */}
        <div className="w-1/4 border-r border-gray-300 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Boards</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-2 py-1 bg-green-500 text-white rounded"
                disabled={!activeBoardId}
                title={
                  activeBoardId
                    ? "Share Selected Moodboard"
                    : "Select a Moodboard to Share"
                }
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
                className={`p-2 rounded cursor-pointer ${
                  activeBoardId === board._id ? "bg-gray-200" : ""
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
                      <option
                        key={folder._id || "no-folder"}
                        value={folder._id || ""}
                      >
                        {folder.name || "No Folder"}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={() => setShowPinterestPanel((prev) => !prev)}
              className="px-3 py-2 bg-pink-500 text-white rounded"
            >
              {showPinterestPanel ? "Close Pinterest" : "Open Pinterest"}
            </button>
          </div>
        </div>

        {/* =============== MAIN BOARD AREA + PINTEREST PANEL =============== */}
        <div className="flex flex-1 flex-row">
          {/* Board Area: Adjust width when the Pinterest panel is open */}
          <div
            className={`transition-all duration-300 ${
              showPinterestPanel ? "w-2/3" : "w-full"
            }`}
          >
            {activeBoard ? (
              <Board
                userId={userId}
                boardId={activeBoard._id}
                elements={activeBoard.elements}
                updateElements={updateActiveBoardElements}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No boards available. Create a new one!</p>
              </div>
            )}
          </div>

          {/* Pinterest Side Panel */}
          {showPinterestPanel && (
            <div
              className="w-1/3 border-l border-gray-300 p-4 overflow-y-auto"
              style={{ maxHeight: "100%" }}
            >
              {/* Title */}
              <h3 className="text-lg font-semibold mb-2">
                Pinterest {embedType === "board" ? "Board" : "Profile"} Embed
              </h3>
              {/* Embed Type Selector */}
              <label className="block mb-2">
                <span className="mr-2 font-medium text-sm text-gray-700">
                  Embed Type:
                </span>
                <select
                  value={embedType}
                  onChange={(e) => setEmbedType(e.target.value)}
                  className="border p-1 text-sm rounded"
                >
                  <option value="board">Board</option>
                  <option value="profile">Profile</option>
                </select>
              </label>
              {/* URL Input */}
              <input
                type="text"
                placeholder={
                  embedType === "board"
                    ? "Enter your Pinterest board URL"
                    : "Enter your Pinterest profile URL"
                }
                className="border p-1 w-full mb-2"
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
              />
              {/* Embed */}
              {pinterestUrl && (
                <div key={pinterestUrl} className="my-4">
                  {embedType === "board" ? (
                    <a
                      data-pin-do="embedBoard"
                      data-pin-board-width="405"
                      data-pin-scale-height="900"
                      data-pin-scale-width="190"
                      href={pinterestUrl}
                    >
                      Loading Pinterest board...
                    </a>
                  ) : (
                    <a
                      data-pin-do="embedUser"
                      data-pin-board-width="400"
                      data-pin-scale-height="240"
                      data-pin-scale-width="80"
                      href={pinterestUrl}
                    >
                      Loading Pinterest profile...
                    </a>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500">
                <strong>Note:</strong> Make sure you enter a valid Pinterest{" "}
                {embedType === "board" ? "board" : "profile"} URL, for example:
                <br />
                {embedType === "board" ? (
                  <em>https://www.pinterest.com/USERNAME/BOARD_NAME/</em>
                ) : (
                  <em>https://www.pinterest.com/USERNAME/</em>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* =============== SHARE MODAL =============== */}
      {showShareModal && (
        <ShareMoodboardModal
          moodboardId={activeBoardId}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
