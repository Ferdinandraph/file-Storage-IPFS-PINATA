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
      const response = await axios.post(`${backendUrl}/api/register`, {
        username,
        password,
      });
      console.log(response.data);
      alert('Registration successful');
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      <button onClick={handleRegister} className="p-2 bg-blue-500 text-white rounded">
        Register
      </button>
      {message && (
        <p className={`mt-2 ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Registration;