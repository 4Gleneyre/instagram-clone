const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const verify = require('./verifyToken');

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
    console.error('Error fetching feed posts:', err); // Log any errors encountered
    res.status(500).json({ message: err.message });
  }
});

// Get all posts
router.get('/', verify, async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new post
router.post('/', verify, async (req, res) => {
  const post = new Post({
    user: req.user._id,
    image: req.body.image,
    caption: req.body.caption
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
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
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

module.exports = router;
