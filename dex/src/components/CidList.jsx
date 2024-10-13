import React, { useEffect, useState } from 'react';
import axios from 'axios';


const CIDList = ({ token }) => {
  const [cids, setCids] = useState([]);

  useEffect(() => {
    const fetchCids = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cids', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCids(res.data.cids);
      } catch (error) {
        console.error('Error fetching CIDs:', error);
      }
    };

    fetchCids();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Stored CIDs</h2>
      <div className="w-full max-w-md space-y-4">
        {cids.map(({ name, cid }, index) => (
          <div key={index} className="p-4 bg-white shadow-md rounded-md border border-gray-300">
            <p className="filename text-lg font-semibold text-gray-700">{name}</p>
            <p className="mt-2 text-gray-600 break-all"><strong>CID:</strong> {cid}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CIDList;
