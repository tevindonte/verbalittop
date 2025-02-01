import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext"; // Import AuthContext

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext); // Access user and loading state from AuthContext
  const userId = user?._id;

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async (task) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/folders/${task.projectId || "null"}/tasks`,
        { ...task, userId }
      );
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Update an existing task
  const updateTask = async (task) => {
    try {
      if (!task._id) {
        console.error("Task ID is undefined");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/tasks/${task._id}`,
        { ...task, userId }
      );
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === response.data._id ? response.data : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (taskId, projectId = null) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/${userId}/folders/${projectId || "null"}/tasks/${taskId}`
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};