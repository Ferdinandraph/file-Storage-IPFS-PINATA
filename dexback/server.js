const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.REACT_APP_PINATA_JWT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cids: [{ name: String, cid: String, txHash: String }],
});

const User = mongoose.model('User', userSchema);

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword, cids: [] });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get User CIDs
app.get('/api/cids', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const { username } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    res.json({ cids: user.cids });
  } catch (error) {
    console.error('Error fetching CIDs:', error);
    res.status(401).json({ message: 'Invalid token or server error' });
  }
});

// Save CID for User
app.post('/api/save-cid', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const { cid, name, txHash } = req.body;

  if (!token) return res.status(401).json({ message: 'No token provided' });
  if (!cid || !name || !txHash) {
    return res.status(400).json({ message: 'CID, name, and txHash are required' });
  }

  try {
    const { username } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.cids.push({ name, cid, txHash });
    await user.save();
    res.status(200).json({ message: 'CID saved successfully' });
  } catch (error) {
    console.error('Error saving CID:', error);
    res.status(401).json({ message: 'Invalid token or server error' });
  }
});

// Optional: Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});