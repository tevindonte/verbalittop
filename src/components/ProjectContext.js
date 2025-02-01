// src/context/ProjectContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the ProjectContext
export const ProjectContext = createContext();

// Create the ProjectProvider component
export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  // Initialize projects from Local Storage or with default data
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Optional: Initialize with default projects
      const defaultProjects = [
        {
          id: 'project1',
          name: 'Project Alpha',
          description: 'Description for Project Alpha',
        },
        {
          id: 'project2',
          name: 'Project Beta',
          description: 'Description for Project Beta',
        },
      ];
      setProjects(defaultProjects);
    }
  }, []);

  // Save projects to Local Storage whenever they change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Function to add a new project
  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  // Function to update an existing project
  const updateProject = (updatedProject) => {
    setProjects(
      projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  // Function to delete a project
  const deleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, updateProject, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
