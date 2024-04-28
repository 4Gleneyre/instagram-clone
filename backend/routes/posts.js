const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const verify = require('./verifyToken');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get feed posts
router.get('/feed', verify, async (req, res) => {
  try {
    // Assuming the User model has a 'following' field that is an array of user IDs
    const user = await User.findById(req.user._id);
    console.log('User ID:', req.user._id); // Log the user ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User following:', user.following); // Log the list of user IDs the user is following
    const posts = await Post.find({ user: { $in: user.following } }).populate('user', 'username');
    console.log('Posts found:', posts); // Log the posts that are being fetched
    res.json(posts);
  } catch (err) {
    console.error('Error fetching feed posts:', err.message, err.stack); // Log any errors encountered along with the stack trace
    res.status(500).json({ message: 'Error fetching feed posts', error: err.message });
  }
});

// Get all posts
router.get('/', verify, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching all posts:', err.message, err.stack); // Log any errors encountered along with the stack trace
    res.status(500).json({ message: 'Error fetching all posts', error: err.message });
  }
});

// Create a new post
router.post('/', upload.single('image'), verify, async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  console.log('Request File:', req.file); // Log the request file

  const post = new Post({
    user: req.user._id,
    image: req.file ? req.file.path : undefined, // Use the file path from multer if available
    caption: req.body.caption
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err.message, err.stack); // Log any errors encountered along with the stack trace
    res.status(400).json({ message: 'Error creating post', error: err.message });
  }
});

// Get all posts by a specific user
router.get('/user/:userId', verify, async (req, res) => {
  try {
    // Validate the user ID before querying
    if (!isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const userPosts = await Post.find({ user: req.params.userId }).populate('user', 'username');
    if (!userPosts) return res.status(404).send('Posts not found');
    res.json(userPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error.message, error.stack); // Log any errors encountered along with the stack trace
    res.status(500).send({ message: 'Error fetching user posts', error: error.message });
  }
});

// Get a single post
router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});

// Middleware to get post by ID
async function getPost(req, res, next) {
  let post;
  try {
    // Validate the post ID before querying
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID format' });
    }

    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    console.error('Error finding post:', err.message, err.stack); // Log any errors encountered along with the stack trace
    return res.status(500).json({ message: 'Error finding post', error: err.message });
  }

  res.post = post;
  next();
}

module.exports = router;
