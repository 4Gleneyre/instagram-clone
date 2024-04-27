const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const fs = require('fs');
const path = require('path');

// User registration
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    console.log('Attempting to save user:', user);
    await user.save();
    console.log('User saved:', user._id);
    res.send({ user: user._id });
  } catch (error) {
    console.error('Signup error:', error);
    const errorLogPath = path.resolve(__dirname, 'error.log');
    console.log('Resolved error log path:', errorLogPath);
    console.log('Attempting to write to error.log file...');
    try {
      if (!fs.existsSync(errorLogPath)) {
        fs.writeFileSync(errorLogPath, '');
        console.log('error.log file created.');
      }
      fs.appendFileSync(errorLogPath, `Test log entry for debugging purposes\n`, { flag: 'a+' });
      fs.appendFileSync(errorLogPath, `Signup error: ${error.stack}\n`, { flag: 'a+' });
      console.log('Error details written to error.log file.');
    } catch (fsError) {
      console.error('File system error during write operation:', fsError);
      console.error('Error stack:', fsError.stack);
    }
    res.status(400).send(error.message);
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('Email not found');

    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

  } catch (error) {
    console.error('Login error:', error);
    const errorLogPath = path.resolve(__dirname, 'error.log');
    if (!fs.existsSync(errorLogPath)) {
      fs.writeFileSync(errorLogPath, '');
    }
    fs.appendFileSync(errorLogPath, `Login error: ${error}\n`, { flag: 'a+' });
    res.status(500).send(error.message);
  }
});

// Follow a user
router.post('/follow/:userId', verify, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).send('User not found');
    }

    // Add to following array of the current user
    if (!currentUser.following.includes(req.params.userId)) {
      currentUser.following.push(req.params.userId);
      await currentUser.save();
    }

    // Add to followers array of the user to follow
    if (!userToFollow.followers.includes(req.user._id)) {
      userToFollow.followers.push(req.user._id);
      await userToFollow.save();
    }

    res.status(200).send('Successfully followed the user');
  } catch (error) {
    console.error('Follow error:', error);
    const errorLogPath = path.resolve(__dirname, 'error.log');
    if (!fs.existsSync(errorLogPath)) {
      fs.writeFileSync(errorLogPath, '');
    }
    fs.appendFileSync(errorLogPath, `Follow error: ${error}\n`, { flag: 'a+' });
    res.status(500).send(error.message);
  }
});

// Unfollow a user
router.post('/unfollow/:userId', verify, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).send('User not found');
    }

    // Remove from following array of the current user
    currentUser.following = currentUser.following.filter(
      (userId) => userId.toString() !== req.params.userId
    );
    await currentUser.save();

    // Remove from followers array of the user to unfollow
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (userId) => userId.toString() !== req.user._id
    );
    await userToUnfollow.save();

    res.status(200).send('Successfully unfollowed the user');
  } catch (error) {
    console.error('Unfollow error:', error);
    const errorLogPath = path.resolve(__dirname, 'error.log');
    if (!fs.existsSync(errorLogPath)) {
      fs.writeFileSync(errorLogPath, '');
    }
    fs.appendFileSync(errorLogPath, `Unfollow error: ${error}\n`, { flag: 'a+' });
    res.status(500).send(error.message);
  }
});

// Test error logging
router.get('/testErrorLog', async (req, res) => {
  try {
    const errorLogPath = path.resolve(__dirname, 'error.log');
    fs.appendFileSync(errorLogPath, `Test log entry: ${new Date().toISOString()}\n`, { flag: 'a+' });
    res.send('Test log entry written to error.log');
  } catch (error) {
    console.error('Error writing test log entry:', error);
    res.status(500).send('Error writing test log entry');
  }
});

// Delete user account
router.delete('/deleteAccount', verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    await User.deleteOne({ _id: req.user._id });
    res.send('Account has been deleted');
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).send('Error deleting account');
  }
});

module.exports = router;
