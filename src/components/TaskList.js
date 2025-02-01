// src/components/TaskList.js
import React, { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onAdd, onUpdate, onDelete }) {
  const [text, setText] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleAdd = () => {
    if (!text.trim() || !start || !end) return;
    onAdd(text, new Date(start), new Date(end));
    setText('');
    setStart('');
    setEnd('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Task Description"
          className="flex-grow p-2 border border-gray-300 rounded-l"
        />
        <input
          type="date"
          value={start}
          onChange={e => setStart(e.target.value)}
          className="p-2 border-t border-b border-gray-300"
        />
        <input
          type="date"
          value={end}
          onChange={e => setEnd(e.target.value)}
          className="p-2 border-t border-b border-gray-300"
        />
        <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded-r">
          Add
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks available. Add a new task!</p>
      ) : (
        <ul className="list-disc pl-5">
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
}
