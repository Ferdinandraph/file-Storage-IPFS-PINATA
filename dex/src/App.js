import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useLocation } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Registration from './components/Registration';
import Login from './components/Login';
import Header from './components/Header';
import CIDList from './components/CidList';
import ListImage from './assets/List_Image.webp';
import UploadImage from './assets/uploadimg.jpg';
import RetrieveImage from './assets/retrieveimg.png';
import './App.css';

const ProtectedRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const uploadRef = useRef(null);
  const retrieveRef = useRef(null);
  const cidsRef = useRef(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleScroll = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <div className="app">
        <Header token={token} setToken={setToken} />
        <h1 className="heading">
          DEX Storage System
        </h1>
        <div className="body-container">
          <p className="description">
            Welcome to DEX Storage, a decentralized file storage solution that leverages the power of IPFS (InterPlanetary File System). 
            Our platform allows you to securely upload, store, and retrieve your files in a distributed network, ensuring high availability and data integrity. 
            Experience the future of file storage with DEX Storage.
          </p>
          <div className="image-links-container flex justify-center flex-wrap">
            <Link to="/upload" className="image-link" onClick={() => handleScroll(uploadRef)}>
              <div className="image-container">
                <img
                  src={UploadImage}
                  alt="Upload Image"
                  className="w-60 h-60 object-cover mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="image-caption">Upload File</p>
              </div>
            </Link>
            <Link to="/retrieve" className="image-link" onClick={() => handleScroll(retrieveRef)}>
              <div className="image-container">
                <img
                  src={RetrieveImage}
                  alt="Retrieve Image"
                  className="w-60 h-60 object-cover mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="image-caption">Retrieve File</p>
              </div>
            </Link>
            <Link to="/cids" className="image-link" onClick={() => handleScroll(cidsRef)}>
              <div className="image-container">
                <img
                  src={ListImage}
                  alt="List Images"
                  className="w-60 h-60 object-cover mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="image-caption">My CIDs</p>
              </div>
            </Link>
          </div>
        </div>
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute token={token}>
                <div ref={uploadRef}>
                  <FileUpload token={token} />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/retrieve"
            element={
              <ProtectedRoute token={token}>
                <div ref={retrieveRef}>
                  <FileList token={token} />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cids"
            element={
              <ProtectedRoute token={token}>
                <div ref={cidsRef}>
                  <CIDList token={token} />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <footer className="bg-gray-100 text-center py-4 border-t-2 border-gray-300 mt-4">
          <p className="text-gray-600">&copy; 2024 DEX Storage. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
