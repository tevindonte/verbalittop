import React from 'react';

export default function TermsConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>
        <p className="text-lg text-gray-600 mb-6">
          By using Verbalit, you agree to these terms. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Provide accurate account information.</li>
          <li>Use Verbalit for lawful purposes only.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Subscription Plans</h2>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li>Free and paid plans are available with varying levels of access.</li>
          <li>Paid subscriptions auto-renew unless canceled prior to the renewal date.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Disclaimer</h2>
        <p className="text-gray-600 mb-6">
          Verbalit is provided \"as-is\" without warranties. We are not liable for any losses
          resulting from the use of our platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Us</h2>
        <p className="text-gray-600">
          For questions about these terms, email us at{" "}
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
