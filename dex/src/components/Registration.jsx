import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/register`, { username, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-milky">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={handleRegister}
          className="w-full p-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white rounded-md hover:opacity-90 transition-all"
        >
          Register
        </button>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Registration;