// src/components/TTSContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TTSContext = createContext();

export function TTSProvider({ children }) {
  const [voices, setVoices] = useState([]);
  const [hasFetchedVoices, setHasFetchedVoices] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    // Only fetch once, if we have NOT yet fetched voices
    if (!hasFetchedVoices) {
      setIsFetching(true);
      axios
        .get("/api/tts/voices")
        .then((response) => {
          setVoices(response.data);
          setHasFetchedVoices(true);
        })
        .catch((err) => {
          console.error("Error fetching voices:", err);
          setFetchError("Failed to fetch voices.");
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }, [hasFetchedVoices]);

  return (
    <TTSContext.Provider
      value={{
        voices,      // array of TTS voices
        isFetching,  // whether we’re still fetching
        fetchError,  // any error message
      }}
    >
      {children}
    </TTSContext.Provider>
  );
}

// Hook to consume TTSContext in child components
export function useTTS() {
  return useContext(TTSContext);
}
