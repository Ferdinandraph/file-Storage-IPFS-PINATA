import React, { useState } from 'react';
import { ethers } from 'ethers';
import { uploadFile } from '../ipfsService';

const FileUpload = ({ token, account }) => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const contractABI = [
    'function uploadFile(string _cid, string _name) public',
    'event FileUploaded(address indexed uploader, string cid, string name, uint256 timestamp)',
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!token) {
      setError('You must be logged in to upload files.');
      return;
    }
    if (!account) {
      setError('Please connect your wallet.');
      return;
    }

    try {
      // Step 1: Upload to IPFS without saving to backend
      const cidFromIpfs = await uploadFile(file, token, false);
      setCid(cidFromIpfs);

      // Step 2: Record on blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.uploadFile(cidFromIpfs, file.name);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      // Step 3: Save to backend with txHash
      await uploadFile(file, token, true, receipt.hash);

      setError('');
    } catch (err) {
      setError('Upload failed: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>
      {account ? (
        <p className="mb-4 text-gray-600">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <p className="mb-4 text-red-600">Wallet not connected</p>
      )}
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
      {txHash && (
        <p className="mt-2 text-green-600">
          Transaction Hash:{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {txHash.slice(0, 10)}...{txHash.slice(-10)}
          </a>
        </p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;