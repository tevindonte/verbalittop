// src/components/Speech2.js
import React, { useState, useContext } from "react";
import axios from "axios";
import pdf from "./pdf/1.pdf";

// Local contexts
import { useText } from "./TextContext";
import { AuthContext } from "../components/AuthContext";

// <-- Import our TTS context
import { useTTS } from "../components/TTSContext";

const Speech2 = () => {
  const { text, setText } = useText();
  const { user } = useContext(AuthContext); // For user info
  const userId = user?._id;

  // We'll display any local error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Playback-related state
  const [audioUrl, setAudioUrl] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState("");

  // Pull voice data from TTSContext (fetched at app level)
  const { voices, isFetching, fetchError } = useTTS();

  // Convert text to speech
  const handleConvert = async () => {
    if (!text.trim()) {
      setErrorMessage("Please enter some text to convert.");
      return;
    }
    setErrorMessage(""); // Clear old errors

    try {
      const response = await axios.post(
        "https://verbalitserver.onrender.com/api/tts/convert",
        { text, voice: selectedVoice, userId },
        { responseType: "blob" }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to convert text to speech.");
    }
  };

  // Save text
  const handleSaveText = async () => {
    const name = prompt("Enter a name for your text:");
    if (!name) {
      alert("Name is required to save text.");
      return;
    }
    try {
  // Playback-related state
      const response = await axios.post("/api/paste-text", { name, text });
      if (response.data.status === "ok") {
        alert(`Text "${name}" saved successfully!`);
      } else {
        alert("Failed to save text.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to save text.");
    }
  };

  // Track & download PDF
  const handleDownload = async () => {
    try {
      await axios.post("/api/track-download");
      const a = document.createElement("a");
      a.href = pdf;
      a.download = "1.pdf";
      a.click();
    } catch (error) {
      console.error("Failed to track download", error);
    }
  };

  return (
    <div className="py-10 bg-black flex flex-col items-center justify-center text-center">
      <div className="bg-[#D02530] rounded-lg shadow-lg p-8 w-3/4">
        <h1 className="text-xl text-[#FEAB1D] font-SecularOne mb-4">
          Text-to-Speech
        </h1>

        {/* Show local errors or fetch errors */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {fetchError && <p className="text-red-500 mb-4">{fetchError}</p>}

        <textarea
          className="w-full bg-white border p-2 resize-none mb-4"
          rows="6"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Voice selection */}
        {isFetching ? (
          <p className="text-white mb-4">Loading voices...</p>
        ) : (
          <select
            className="w-full bg-white border p-2 mb-4"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            <option value="">Select a voice</option>
            {voices.map((voice) => (
              <option key={voice.ShortName} value={voice.ShortName}>
                {voice.DisplayName} - {voice.LocaleName}
              </option>
            ))}
          </select>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleConvert}
            disabled={isFetching || !selectedVoice}
            className="bg-gradient-to-br from-[#D02530] to-[#FFB41F] text-black px-4 py-2 rounded-md"
          >
            Convert Text to Speech
          </button>
          <button
            onClick={handleSaveText}
            className="bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-white px-4 py-2 rounded-md"
          >
            Save Text
          </button>
          <button
            onClick={handleDownload}
            className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white px-4 py-2 rounded-md"
          >
            Download "Know Grow Change"
          </button>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
            <div className="flex items-center space-x-4">
              {/* Rewind */}
              <button
                onClick={() => {
                  const audioElement = document.getElementById("audio-player");
                  audioElement.currentTime = Math.max(
                    audioElement.currentTime - 15,
                    0
                  );
                }}
                className="bg-gray-200 text-black px-2 py-1 rounded-md hover:bg-gray-300"
              >
                -15s
              </button>

              {/* Audio */}
              <audio
                id="audio-player"
                controls
                src={audioUrl}
                className="w-full"
              />

              {/* Forward */}
              <button
                onClick={() => {
                  const audioElement = document.getElementById("audio-player");
                  audioElement.currentTime = Math.min(
                    audioElement.currentTime + 15,
                    audioElement.duration
                  );
                }}
                className="bg-gray-200 text-black px-2 py-1 rounded-md hover:bg-gray-300"
              >
                +15s
              </button>
            </div>

            {/* Speed Control */}
            <div className="flex flex-col items-center mt-4">
              <label htmlFor="speed-wheel" className="text-black mb-2">
                Adjust Playback Speed:
              </label>
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  id="speed-wheel"
                  min="0.5"
                  max="2"
                  step="0.01"
                  value={speed}
                  onChange={(e) => {
                    const newSpeed = parseFloat(e.target.value);
                    setSpeed(newSpeed);
                    const audioElement =
                      document.getElementById("audio-player");
                    if (audioElement) {
                      audioElement.playbackRate = newSpeed;
                    }
                  }}
                  className="w-64 h-6 appearance-none bg-gray-200 rounded-md"
                />
                <div className="ml-4 text-black text-lg">{speed.toFixed(2)}x</div>
              </div>
              <button
                onClick={() => {
                  setSpeed(1);
                  const audioElement = document.getElementById("audio-player");
                  if (audioElement) {
                    audioElement.playbackRate = 1;
                  }
                }}
                className="mt-4 px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
              >
                Reset to Default (1x)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Speech2;
