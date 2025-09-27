const express = require('express');
const routes = express.Router();
const user = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// It's highly recommended to use an environment variable for the JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_that_is_long';


routes.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await user.create({ username, email, password: hashedPassword });

    // Also sign a token for the new user to log them in immediately
    const token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User created successfully',
      token,
    });
  } catch (err) {
    next(err);
  }
});

routes.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: foundUser._id, username: foundUser.username, email: foundUser.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (err) {
    next(err);
  }
});

module.exports = routes;
