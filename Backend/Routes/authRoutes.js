const express = require('express');
const routes = express.Router();
const user = require('../Models/userModel');

routes.get('/login', (req, res) => {
  res.send('Hello from authRoutes');
});

routes.post('/login', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const data = await user.create({ username, email, password });
    res.status(201).json({
      message: 'User created successfully',
      user: data,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = routes;
