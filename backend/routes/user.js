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
  // User login logic...
});

// User deletion
router.delete('/:id', verify, async (req, res) => {
  // User deletion logic...
});

export default router;
