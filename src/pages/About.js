import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Verbalit</h1>
        <p className="text-lg text-gray-600 mb-6">
          Verbalit is an all-in-one creativity and productivity platform designed to revolutionize
          the way you plan, create, and collaborate.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
        <p className="text-gray-600 mb-6">
          To empower creators, teams, and learners to achieve their best work effortlessly by
          providing a centralized creativity hub.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Verbalit?</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Centralized Creativity Hub</li>
          <li>Eliminate Tool Overload</li>
          <li>Streamline Collaboration</li>
          <li>Accessibility and Learning</li>
        </ul>
      </div>
    </div>
  );
}
