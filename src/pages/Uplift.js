import React from "react";

const Uplift = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
      <iframe
        src="https://app.botpress.cloud/XYZ1234/webchat" // Replace with your actual Botpress Webchat URL
        className="w-full h-full border-none"
        allow="microphone; camera"
      />
    </div>
  );
};

export default Uplift;
