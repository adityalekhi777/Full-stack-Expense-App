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


const crypto = require('crypto');
const nodemailer = require('nodemailer');

routes.post('/forgot-password', async (req, res, next) => {
    const { email } = req.body;
    try {
        const oldUser = await user.findOne({ email });
        if (!oldUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "5m" });
        const link = `http://localhost:5173/reset-password/${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: oldUser.email,
            subject: "Password Reset",
            text: `Please click on the following link to reset your password: ${link}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email" });
            }
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ message: "Email sent successfully" });
        });

    } catch (err) {
        next(err);
    }
});

routes.post('/reset-password/:token', async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const oldUser = await user.findOne({ email: jwt.decode(token).email });
        if (!oldUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const secret = JWT_SECRET + oldUser.password;
        const decoded = jwt.verify(token, secret);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await user.updateOne({ _id: oldUser._id }, { $set: { password: hashedPassword } });

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = routes;

