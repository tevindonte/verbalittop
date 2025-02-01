// src/components/TaskItem.js
import React, { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [start, setStart] = useState(task.start.split('T')[0]); // Format date
  const [end, setEnd] = useState(task.end.split('T')[0]);
  const [isComplete, setIsComplete] = useState(task.isComplete);

  const handleSave = () => {
    const updatedTask = {
      ...task,
      text,
      start: new Date(start),
      end: new Date(end),
      isComplete,
    };
    onUpdate(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setText(task.text);
    setStart(task.start.split('T')[0]);
    setEnd(task.end.split('T')[0]);
    setIsComplete(task.isComplete);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center justify-between mb-2">
      {isEditing ? (
        <div className="flex-grow flex items-center">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="date"
            value={start}
            onChange={e => setStart(e.target.value)}
            className="p-2 border border-gray-300 rounded mr-2"
          />
          <input
            type="date"
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      ) : (
        <div className="flex-grow flex items-center">
          <input
            type="checkbox"
            checked={isComplete}
            onChange={e => {
              setIsComplete(e.target.checked);
              onUpdate({ ...task, isComplete: e.target.checked });
            }}
            className="mr-2"
          />
          <span className={isComplete ? 'line-through text-gray-500' : ''}>{task.text}</span>
          <span className="ml-4 text-sm text-gray-600">
            {new Date(task.start).toLocaleDateString()} - {new Date(task.end).toLocaleDateString()}
          </span>
        </div>
      )}
      <div className="flex items-center">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-500 mr-2">Save</button>
            <button onClick={handleCancel} className="text-gray-500">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-blue-500 mr-2">Edit</button>
            <button onClick={() => onDelete(task._id)} className="text-red-500">Delete</button>
          </>
        )}
      </div>
    </li>
  );
}
