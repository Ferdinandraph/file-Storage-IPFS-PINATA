import React, { useState } from 'react';
import { uploadFile } from '../ipfsService';

const FileUpload = ({ token }) => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      if (!token) {
        setError('You must be logged in to upload files.');
        return;
      }
      try {
        const path = await uploadFile(file, token);
        setCid(path);
        setError(''); // Clear previous errors
      } catch (err) {
        setError('Upload failed: ' + err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>
      <div className="w-full max-w-md flex flex-col items-center space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleUpload}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Upload
        </button>
      </div>
      {cid && <p className="mt-4 text-green-600">File uploaded with CID: {cid}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;
