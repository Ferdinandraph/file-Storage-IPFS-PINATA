import React, { useState } from 'react';
import { getFile } from '../ipfsService';

const FileList = () => {
  const [cid, setCid] = useState('');
  const [fileData, setFileData] = useState({ url: '', type: '' });

  const handleRetrieve = async () => {
    if (!cid) {
      alert('Please enter a CID');
      return;
    }

    try {
      const data = await getFile(cid);
      setFileData(data);
    } catch (error) {
      console.error('Error retrieving file:', error);
    }
  };

  const renderFile = () => {
    if (!fileData.url) return null;

    if (fileData.type.startsWith('image/')) {
      return <img src={fileData.url} alt="Retrieved file" style={{ maxWidth: '100%' }} />;
    } else if (fileData.type === 'application/pdf') {
      return <iframe src={fileData.url} title="Retrieved file" style={{ width: '100%', height: '600px' }} />;
    } else {
      return (
        <div>
          <a href={fileData.url} download>
            Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Retrieve File</h2>
      <div className="w-full max-w-md flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Enter CID"
          value={cid}
          onChange={(e) => setCid(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleRetrieve}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retrieve
        </button>
      </div>
      <div className="mt-8 w-full max-w-md">
        {renderFile()}
      </div>
    </div>
  );
};

export default FileList;
