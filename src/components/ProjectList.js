import React, { useState } from 'react';
import ProjectItem from './ProjectItem';

export default function ProjectList({ projects, tasks, onAdd, onDelete }) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName('');
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Project"
          className="flex-grow p-2 border border-gray-300 rounded-l"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded-r">
          Add
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available. Add a new project!</p>
      ) : (
        projects.map((project) => (
          <ProjectItem
            key={project._id}
            project={project}
            tasks={tasks} // Pass tasks related to all projects
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
