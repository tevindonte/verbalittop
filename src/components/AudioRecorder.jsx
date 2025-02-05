import React, { useState } from "react";
import axios from "axios";

export default function AudioRecorder({ folderId, onAddFile }) {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
  
    const chunks = []; // Local array to store chunks
  
    recorder.ondataavailable = (e) => {
      console.log("Audio chunk available:", e.data);
      chunks.push(e.data); // Push directly to the local array
    };
  
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      console.log("Final Blob size:", blob.size);
  
      if (blob.size > 0) {
        uploadAudio(blob); // Handle blob upload or processing
      } else {
        console.error("Recording resulted in an empty Blob.");
      }
    };
  
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const uploadAudio = (blob) => {
    const audioUrl = URL.createObjectURL(blob);
    console.log("Audio URL:", audioUrl);
  
    // Play the audio for testing
    const audio = new Audio(audioUrl);
    audio.play();
  
    // Proceed with upload logic
    const formData = new FormData();
    formData.append("file", blob, `recording-${Date.now()}.webm`);
  
    axios
      .post(`https://verbalitserver.onrender.com/gridfs-upload/${folderId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Upload successful:", response.data);
        onAddFile(response.data.file);
      })
      .catch((err) => {
        console.error("Error uploading audio:", err);
      });
  };
  

  const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    setIsRecording(false);
  }
};

  
  

  return (
    <div className="mt-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
