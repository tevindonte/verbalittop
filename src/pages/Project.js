import React, { useContext, useEffect, useState } from "react";
import ProjectList from "../components/ProjectList";
import Nav from "../components/NavCal";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const userId = user?._id; // or however you store your userId

  useEffect(() => {
    if (!userId) return; // Wait until we have userId
    const fetchData = async () => {
      try {
        // GET all folders for this user
        const projectsResponse = await axios.get(
          `http://localhost:5000/api/users/${userId}/folders`
        );
        // GET all tasks for this user (optional)
        const tasksResponse = await axios.get(
          `http://localhost:5000/api/users/${userId}/tasks`
        );
        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const addProject = async (name) => {
    if (!userId) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/folders`,
        { name }
      );
      setProjects([...projects, response.data]);
    } catch (err) {
      console.error("Error adding project:", err);
      setError("Failed to add project.");
    }
  };

  const deleteProject = async (id) => {
    if (!userId) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}/folders/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      // Also remove tasks associated with that folder from the tasks state
      setTasks(tasks.filter((t) => t.projectId !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="container mx-auto p-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ProjectList
          projects={projects}
          tasks={tasks}
          onAdd={addProject}
          onDelete={deleteProject}
        />
      </div>
    </div>
  );
}
