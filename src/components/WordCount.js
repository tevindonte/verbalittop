import React from 'react';

const WordCount = ({ wordCount, charCount, pageColor }) => {
  return (
    <div
      className="absolute top-4 right-6 text-white font-bold"
      style={{
        backgroundColor: pageColor,
        padding: '5px 10px',
        borderRadius: '10px',
        zIndex: 10, // Ensure it stays above the text area
      }}
    >
      Word Count: {wordCount} | Character Count: {charCount}
    </div>
  );
};

export default WordCount;
