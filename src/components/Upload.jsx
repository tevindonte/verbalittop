import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useText } from './TextContext'; // Import the useText hook
import { AuthContext } from "../components/AuthContext";

export default function Upload() {
  const [file, setFile] = useState('');
  const { setText } = useText(); // Get setText from context
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const userId = user?._id; // Get userId from the authenticated user

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await axios.post(
        `https://verbalitserver.onrender.com/upload-files?userId=${userId}`, // Include userId in the request
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (result.data.status === 'ok') {
        setText(result.data.extractedText); // Update context with extracted text
        //console.log('Extracted Text:', result.data.extractedText);
      } else {
        console.error('Error extracting text');
      }
    } catch (error) {
      console.error('Error during file upload', error);
    }
  };

  return (
    <div className='bg-white'>
      <form className='formStyle' onSubmit={submitImage}>
        <label
          className='block mb-2 text-sm font-medium text-white dark:text-white'
          htmlFor='file_input'
        >
          Upload PDF File
        </label>
        <input
          className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
          aria-describedby='file_input_help'
          id='file_input'
          type='file'
          accept='application/pdf'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <p
          className='mt-1 text-sm text-gray-500 dark:text-gray-300'
          id='file_input_help'
        >
          (MAX. 100MB).
        </p>
        <button
          className='text-black bg-gradient-to-br border-yellow-500 from-[#D02530] to-[#FFB41F] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-1 mb-2'
          type='submit'
        >
          Submit
        </button>
      </form>
    </div>
  );
}