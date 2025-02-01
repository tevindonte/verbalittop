import React from 'react';

const ImageUpload = () => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      // Add the new image to the state
    }
  };

  return (
    <button>
      <input type="file" onChange={handleFileChange} />
      Upload Image
    </button>
  );
};

export default ImageUpload;
