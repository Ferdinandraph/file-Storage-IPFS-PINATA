import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      setToken(response.data.token);
      alert("successfully logged in")
      navigate('/');
    } catch (error) {
      setMessage(error.response.data.message);
      alert("Login unsuccessfull")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
      <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded">Login</button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default Login;
