import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Registration from './components/Registration';
import Login from './components/Login';
import Header from './components/Header';
import CIDList from './components/CidList';
import UploadIcon from './assets/upload-icon.png';
import RetrieveIcon from './assets/retrieve-icon.png';
import ListIcon from './assets/list-icon.png';
import './App.css';

const ProtectedRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [account, setAccount] = useState(localStorage.getItem('walletAccount') || '');
  const uploadRef = useRef(null);
  const retrieveRef = useRef(null);
  const cidsRef = useRef(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      localStorage.setItem('walletAccount', accounts[0]);

      window.ethereum.on('accountsChanged', (newAccounts) => {
        const newAccount = newAccounts[0] || '';
        setAccount(newAccount);
        localStorage.setItem('walletAccount', newAccount);
      });
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum && localStorage.getItem('walletAccount')) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            localStorage.removeItem('walletAccount');
            setAccount('');
          }
        } catch (err) {
          console.error('Error checking wallet:', err);
        }
      }
    };
    checkWallet();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      setAccount('');
      localStorage.removeItem('walletAccount');
    }
  }, [token]);

  const handleScroll = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <div className="app flex flex-col min-h-screen bg-milky text-gray-800">
        <Header
          token={token}
          setToken={setToken}
          account={account}
          connectWallet={connectWallet}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-4xl font-extrabold text-center mb-6">Dex File Storage</h1>
          <p className="text-lg text-center mb-8 max-w-2xl mx-auto">
            Effortlessly store and access your files with the power of decentralized technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/upload"
              className="card bg-white/80 p-6 rounded-xl hover:bg-white transition-all shadow-md"
              onClick={() => handleScroll(uploadRef)}
            >
              <img src={UploadIcon} alt="Upload file" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center">Upload File</h3>
            </Link>
            <Link
              to="/retrieve"
              className="card bg-white/80 p-6 rounded-xl hover:bg-white transition-all shadow-md"
              onClick={() => handleScroll(retrieveRef)}
            >
              <img src={RetrieveIcon} alt="Retrieve file" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center">Retrieve File</h3>
            </Link>
            <Link
              to="/cids"
              className="card bg-white/80 p-6 rounded-xl hover:bg-white transition-all shadow-md"
              onClick={() => handleScroll(cidsRef)}
            >
              <img src={ListIcon} alt="List of stored CIDs" className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center">My Vault</h3>
            </Link>
          </div>
        </main>

        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute token={token}>
                <div ref={uploadRef}>
                  <FileUpload token={token} account={account} />
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

        <footer className="bg-cream py-4 text-center text-gray-600">
          <p className="text-sm">© 2025 Dex File Storage. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;