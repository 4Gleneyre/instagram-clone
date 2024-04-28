import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import verify from './verifyToken.js';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// POST request to create a new post
router.post('/', verify, upload.single('file'), async (req, res) => {
  const newPost = new Post({
    userId: req.user._id,
    desc: req.body.desc,
  });

  if (req.file) {
    const { path } = req.file;
    newPost.img = fs.readFileSync(path);
    // Add logic to handle file type and conversion if necessary
  }

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request to fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request to fetch posts by a specific user
router.get('/user/:userId', async (req, res) => {
  if (!isValidObjectId(req.params.userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const posts = await Post.find({ userId: req.params.userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET request to fetch the feed of posts from followed users
router.get('/feed', verify, async (req, res) => {
  try {
    // Find the user and get the list of followed users
    const user = await User.findById(req.user._id);
    const followedUsers = user.following.map(followedUser => followedUser._id);

    // Find posts where the user is in the list of followed users
    const posts = await Post.find({ user: { $in: followedUsers } }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT request to update a post
router.put('/:id', verify, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid post ID');
  }

  if (req.body.userId !== req.user._id) {
    return res.status(401).send('You can only update your own posts');
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    }, { new: true });
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE request to delete a post
router.delete('/:id', verify, async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid post ID');
  }

  const post = await Post.findById(req.params.id);
  if (post.userId !== req.user._id) {
    return res.status(401).send('You can only delete your own posts');
  }

  try {
    await post.remove();
    res.status(200).send('Post has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Set up __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default router;
