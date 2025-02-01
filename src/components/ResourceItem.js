// src/components/ResourceItem.js
import React from 'react';

export default function ResourceItem({ resource, onDelete }) {
  return (
    <div className="border p-4 rounded shadow relative">
      {resource.type === 'image' ? (
        <div>
          <img
            src={resource.data}
            alt={resource.name}
            className="w-full h-auto mb-2 rounded"
          />
          <p className="text-sm text-gray-600">{resource.name}</p>
        </div>
      ) : (
        <div>
          <audio controls className="w-full mb-2">
            <source src={resource.data} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-sm text-gray-600">{resource.name}</p>
        </div>
      )}
      {/* Delete Button */}
      <button
        onClick={() => onDelete(resource._id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        title="Delete Resource"
      >
        {/* Trash Icon (Using SVG for better visuals) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v1H8V5a2 2 0 012-2z" />
        </svg>
      </button>
    </div>
  );
}
