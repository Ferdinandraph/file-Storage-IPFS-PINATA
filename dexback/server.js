const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.REACT_APP_PINATA_JWT;

app.use(cors());
app.use(express.json());

const usersFilePath = './users.json';

// Read users from JSON file
const readUsers = () => {
  if (fs.existsSync(usersFilePath)) {
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
  }
  return [];
};

// Write users to JSON file
const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// User Registration
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = readUsers();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { username, password, cids: [] };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});

// User Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(user => user.username === username);

  console.log(`Login attempt - Username: ${username}, Password: ${password}`);

  if (!user) {
    console.log('User not found');
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  if (password !== user.password) {
    console.log('Incorrect password');
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Get User CIDs
app.get('/api/cids', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const { username } = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const user = users.find(user => user.username === username);
    if (user) {
      res.json({ cids: user.cids });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Save CID for User
app.post('/api/save-cid', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const { cid, name } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const { username } = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
      users[userIndex].cids.push({ name, cid });
      writeUsers(users);
      res.status(200).json({ message: 'CID saved successfully' });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
