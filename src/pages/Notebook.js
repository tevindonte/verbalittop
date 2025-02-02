// Notebook.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/NavNote";
import ShareModal from "../components/NotebookShareModal"; // Import ShareModal
import { AuthContext } from "../components/AuthContext";
import TextEditor2 from "../components/TextEditor copy";

export default function Notebook() {
  const [pages, setPages] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { user, loading } = useContext(AuthContext);
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
  // Fetch pages and folders from the backend
  useEffect(() => {
    const fetchPages = async () => {
      try {
        console.log("Fetching pages...");
        const response = await axios.get(
          `https://verbalitserver.onrender.com/api/notebook/${userId}/pages`
        );
        console.log("Pages fetched:", response.data);
        setPages(response.data);
        if (response.data.length > 0) {
          setCurrentPage(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    const fetchFolders = async () => {
      try {
        console.log("Fetching folders...");
        const response = await axios.get(`https://verbalitserver.onrender.com/api/users/${userId}/folders`);
        console.log("Folders fetched:", response.data);
        setFolders([{ _id: null, name: "No Folder" }, ...response.data]);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    if (userId) {
      fetchPages();
      fetchFolders();
    }
  }, [userId]);

  const handleAddPage = async () => {
    const newPage = { name: `Page ${pages.length + 1}`, content: "" };
    try {
      const response = await axios.post(
        `https://verbalitserver.onrender.com/api/notebook/${userId}/pages`,
        newPage
      );
      setPages([...pages, response.data]);
      setCurrentPage(response.data._id);
    } catch (error) {
      console.error("Error adding page:", error);
    }
  };

  const handleSelectPage = (id) => {
    setCurrentPage(id);
  };

  const handleDeletePage = async (id) => {
    try {
      await axios.delete(`https://verbalitserver.onrender.com/api/notebook/pages/${id}`);
      const updatedPages = pages.filter((page) => page._id !== id);
      setPages(updatedPages);
      if (currentPage === id && updatedPages.length > 0) {
        setCurrentPage(updatedPages[0]._id);
      } else if (updatedPages.length === 0) {
        setCurrentPage(null);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  const handleUpdateContent = async (id, content) => {
    try {
      const response = await axios.put(
        `https://verbalitserver.onrender.com/api/notebook/pages/${id}`,
        { content }
      );
      setPages(pages.map((page) => (page._id === id ? response.data : page)));
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleUpdateFolder = async (pageId, newFolderId) => {
    try {
      const response = await axios.put(
        `https://verbalitserver.onrender.com/api/notebook/pages/${pageId}/link-folder`,
        { folderId: newFolderId }
      );
      setPages(pages.map((page) => 
        page._id === pageId ? { ...page, folderId: newFolderId } : page
      ));
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  // Sidebar resizing logic
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = Math.max(200, e.clientX);
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const currentPageContent = pages.find((page) => page._id === currentPage);

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <Nav />
      <div className="flex bg-[#F3F4F6] h-screen">
        {/* Sidebar */}
        <div
          className="bg-gray-200 p-4"
          style={{ width: `${sidebarWidth}px`, minWidth: "200px" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Pages</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleAddPage}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                + New Page
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Share
              </button>
            </div>
          </div>
          <ul>
            {pages.map((page) => (
              <li
                key={page._id}
                className={`flex justify-between items-center p-2 cursor-pointer ${
                  currentPage === page._id ? "bg-blue-100" : ""
                }`}
              >
                <span onClick={() => handleSelectPage(page._id)} className="flex-1">
                  {page.name}
                </span>
                
                {/* Folder Dropdown */}
                <select
                  value={page.folderId || ""}
                  onChange={(e) =>
                    handleUpdateFolder(page._id, e.target.value === "" ? null : e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  {folders.map((folder) => (
                    <option key={folder._id || "no-folder"} value={folder._id || ""}>
                      {folder.name || "No Folder"}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePage(page._id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resize handle */}
        <div
          className="w-2 bg-gray-400 cursor-col-resize"
          onMouseDown={handleMouseDown}
        ></div>

        {/* Text Editor */}
        <div className="flex-1">
          {currentPageContent && (
            <TextEditor2
              content={currentPageContent.content}
              onChange={(content) => handleUpdateContent(currentPage, content)}
              pageId={currentPage} // Ensure pageId is passed if needed
            />
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          pageId={currentPage} // Correctly pass pageId
        />
      )}
    </div>
  );
}
