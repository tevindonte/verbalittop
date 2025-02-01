import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-lg text-gray-600 mb-6">
          At Verbalit, we are committed to protecting your personal information and ensuring your
          data is secure.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">What Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Personal Information: Name, email address, and payment details.</li>
          <li>Usage Data: Interaction history, preferences, and feedback.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>To provide and improve our services.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To send updates, notifications, and relevant content.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Rights</h2>
        <p className="text-gray-600">
          You have the right to access, update, or delete your information. Contact us at{" "}
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
