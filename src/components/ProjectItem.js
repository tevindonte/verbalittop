import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectItem({ project, tasks, onDelete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Filter tasks related to this project
    const projectTasks = tasks.filter((task) => task.projectId === project._id);
    const completedTasks = projectTasks.filter((task) => task.isComplete).length;
    const totalTasks = projectTasks.length;

    // Calculate progress
    setProgress(totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0);
  }, [tasks, project._id]); // Recalculate progress when tasks change

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <Link to={`/projects/${project._id}`} className="text-lg font-semibold text-blue-600">
          {project.name}
        </Link>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div
            className="bg-green-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{progress}% Complete</span>
      </div>
      <button onClick={() => onDelete(project._id)} className="text-red-500">
        Delete
      </button>
    </div>
  );
}
