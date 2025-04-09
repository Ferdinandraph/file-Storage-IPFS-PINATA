import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CIDList = ({ token }) => {
  const [cids, setCids] = useState([]);
  const [error, setError] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchCids = async () => {
      if (!token) {
        setError('No token provided');
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/cids`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', res.data);
        setCids(res.data.cids || []);
        setError('');
      } catch (error) {
        console.error('Error fetching CIDs:', error.response?.data || error.message);
        setError('Failed to fetch CIDs: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchCids();
  }, [token, backendUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Stored CIDs</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="w-full max-w-md space-y-4">
        {cids.length === 0 ? (
          <p className="text-gray-600">No files uploaded yet.</p>
        ) : (
          cids.map(({ name, cid, txHash }, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md rounded-md border border-gray-300"
            >
              <p className="filename text-lg font-semibold text-gray-700">{name}</p>
              <p className="mt-2 text-gray-600 break-all">
                <strong>CID:</strong> {cid}
              </p>
              {txHash && (
                <p className="mt-2 text-gray-600 break-all">
                  <strong>Tx Hash:</strong>{' '}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CIDList;