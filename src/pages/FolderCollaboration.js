import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TaskList from "../components/TaskList";
import ResourcesList from "../components/ResourcesList";
import FileUploader from "../components/FileUploader";

export default function FolderCollaboration() {
  const { folderId, token } = useParams();
  const [folder, setFolder] = useState(null);
  const [role, setRole] = useState("viewer");
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        // Verify token and get role
        const roleResponse = await axios.get(
          `http://localhost:5000/api/folders/collaborate/${folderId}/${token}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRole(roleResponse.data.role);

        // Fetch folder details
        const folderResponse = await axios.get(
          `http://localhost:5000/api/folders/${folderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFolder(folderResponse.data);

        // Fetch tasks for this folder
        const tasksResponse = await axios.get(
          `http://localhost:5000/api/folders/${folderId}/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(tasksResponse.data);

        // Fetch resources for this folder
        const resourcesResponse = await axios.get(
          `http://localhost:5000/api/folders/${folderId}/resources`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResources(resourcesResponse.data);
      } catch (error) {
        console.error("Error fetching folder data:", error);
        setError(
          error.response?.data?.message || "Invalid or expired token."
        );
      }
    };

    fetchFolderData();
  }, [folderId, token]);

  // Create a new task (using the folder endpoint)
  const addTask = async (text, start, end, backColor) => {
    try {
      const response = await axios.post(
        `https://verbalitserver.onrender.com/api/collab/folders/${folderId}/tasks`,
        { text, start, end, backColor }, // No userId is sent here.
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task.");
    }
  };
  
  

  // Update a task using the common update endpoint (PUT /api/tasks/:taskId)
  const updateTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `https://verbalitserver.onrender.com/api/tasks/${updatedTask._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) =>
          t._id === response.data._id ? response.data : t
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task.");
    }
  };

  // Delete a task using the folder endpoint for deletion
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(
        `https://verbalitserver.onrender.com/api/folders/${folderId}/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  const handleAddFile = (newFile) => {
    setResources([...resources, newFile]);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!folder) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{folder.name}</h1>
      <p>
        Role: <strong>{role}</strong>
      </p>

      <div className="mt-4">
        <TaskList
          tasks={tasks}
          onAdd={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          role={role}
        />
      </div>

      <div className="mt-4">
        <ResourcesList
          folderId={folderId}
          resources={resources}
          role={role}
          token={token}
          onAddFile={handleAddFile}
        />
      </div>
    </div>
  );
}
