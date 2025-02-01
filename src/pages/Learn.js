import React from 'react';

export default function Learn() {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Learn How to Use Verbalit</h1>
        <p className="text-lg text-gray-600 mb-6">
          Maximize your creativity and productivity with these resources and tutorials.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Start Guides</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Getting Started with Moodboarding</li>
          <li>How to Organize Notes Like a Pro</li>
          <li>Using Text-to-Speech for Accessibility</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Video Tutorials</h2>
        <p className="text-gray-600 mb-4">Watch step-by-step videos to get the most out of Verbalit:</p>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Introduction to Verbalit</li>
          <li>Creating a Moodboard</li>
          <li>Collaborating with Your Team</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">FAQs</h2>
        <p className="text-gray-600">
          Have questions? Check out our Frequently Asked Questions or contact us at{" "}
          <a
            href="mailto:verbalitapp@gmail.com"
            className="text-blue-500 underline hover:text-blue-700"
          >
            verbalitapp@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
