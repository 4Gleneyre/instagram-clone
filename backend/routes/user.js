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

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    res.json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Follow a user
router.post('/:id/follow', verify, async (req, res) => {
  // Check if the user to follow exists
  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) return res.status(404).send('User to follow not found');

  // Check if the current user exists
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) return res.status(404).send('Current user not found');

  // Check if already following
  if (currentUser.following.includes(req.params.id)) {
    return res.status(400).send('You are already following this user');
  }

  // Add to following and followers
  currentUser.following.push(req.params.id);
  userToFollow.followers.push(req.user._id);

  // Save the updated users
  await currentUser.save();
  await userToFollow.save();

  res.send('Successfully followed the user');
});

// Unfollow a user
router.post('/:id/unfollow', verify, async (req, res) => {
  // Check if the user to unfollow exists
  const userToUnfollow = await User.findById(req.params.id);
  if (!userToUnfollow) return res.status(404).send('User to unfollow not found');

  // Check if the current user exists
  const currentUser = await User.findById(req.user._id);
  if (!currentUser) return res.status(404).send('Current user not found');

  // Check if not following
  if (!currentUser.following.includes(req.params.id)) {
    return res.status(400).send('You are not following this user');
  }

  // Remove from following and followers
  currentUser.following = currentUser.following.filter(
    (userId) => userId.toString() !== req.params.id
  );
  userToUnfollow.followers = userToUnfollow.followers.filter(
    (userId) => userId.toString() !== req.user._id
  );

  // Save the updated users
  await currentUser.save();
  await userToUnfollow.save();

  res.send('Successfully unfollowed the user');
});

export default router;
