import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import verify from './verifyToken.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  // User registration logic...
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email is not found');

    // Check password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

  } catch (error) {
    res.status(500).send(error);
  }
});

// User deletion
router.delete('/:id', verify, async (req, res) => {
  // User deletion logic...
});

export default router;
