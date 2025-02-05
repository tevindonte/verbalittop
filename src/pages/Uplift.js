import React, { useContext } from "react";
import Nav from "../components/NavCal";
import { AuthContext } from "../components/AuthContext";

export default function Uplift() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">
        <p>You must be logged in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <Nav />
      <iframe
        src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/05/19/20250205192922-9IOM9W9U.json"
        className="flex-grow border-none"
        allow="microphone; camera"
      />
    </div>
  );
}
