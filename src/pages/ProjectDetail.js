import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/NavCal";
import TaskList from "../components/TaskList";
import ResourcesList from "../components/ResourcesList";
import ShareFolderModal from "../components/ShareFolderModal"; // Import the modal
import axios from "axios";
import { AuthContext } from "../components/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams(); // This is the folderId in the new scheme
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]); // State for resources
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // Manage modal visibility

  const { user } = useContext(AuthContext);
  const userId = user?._id;

  useEffect(() => {
    if (!userId || !id) return;
    const fetchProject = async () => {
      try {
        // GET single folder by ID for this user
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/folders/${id}`
        );
        setProject(response.data);
        setLoadingProject(false);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project.");
        setLoadingProject(false);
      }
    };
    fetchProject();
  }, [userId, id]);

  useEffect(() => {
    if (!userId || !id) return;
    const fetchTasks = async () => {
      try {
        // GET tasks for this folder
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/folders/${id}/tasks`
        );
        setTasks(response.data);
        setLoadingTasks(false);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks.");
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [userId, id]);

  const addTask = async (text, start, end) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/folders/${id}/tasks`,
        { text, start, end }
      );
      setTasks([...tasks, response.data]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task.");
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      // We update the task via /api/users/:userId/tasks/:taskId
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/tasks/${updatedTask._id}`,
        updatedTask
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === response.data._id ? response.data : t))
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // /api/users/:userId/folders/:folderId/tasks/:taskId
      await axios.delete(
        `http://localhost:5000/api/users/${userId}/folders/${id}/tasks/${taskId}`
      );
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
    }
  };

  // This updater function will handle both replacing and appending to the resources list.
  const updateResources = useCallback((update) => {
    setResources((prevResources) => {
      // If "update" is an array, then replace the entire list.
      if (Array.isArray(update)) {
        return update;
      } else {
        // Append only if this file isn't already present (to avoid duplicates)
        if (prevResources.find((item) => item._id === update._id)) {
          return prevResources;
        }
        return [...prevResources, update];
      }
    });
  }, []);

  if (loadingProject || loadingTasks) {
    return (
      <div>
        <Nav />
        <div className="container mx-auto p-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div>
        <Nav />
        <div className="container mx-auto p-4">
          <p>Project not found.</p>
        </div>
      </div>
    );
  }

  // Determine user role: if the current user is the project owner, treat as "owner", otherwise "editor"
  const userRole = project.owner === userId ? "owner" : "editor";

  return (
    <div>
      <Nav />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
        {/* Share Button */}
        <button
          onClick={() => setIsShareModalOpen(true)} // Open the share modal
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Share Folder
        </button>
        {/* Tasks Section */}
        <div className="mb-8">
          <TaskList
            tasks={tasks}
            onAdd={addTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
        {/* Resources Section */}
        <div>
          {/* Pass the computed role, current resources list, and the updater function */}
          <ResourcesList
            folderId={id}
            role={userRole}
            resources={resources}
            onAddFile={updateResources}
          />
        </div>
        {/* Share Modal */}
        {isShareModalOpen && (
          <ShareFolderModal
            folderId={id}
            onClose={() => setIsShareModalOpen(false)} // Close the modal
          />
        )}
      </div>
    </div>
  );
}
