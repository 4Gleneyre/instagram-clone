const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB URI
const dbURI = "mongodb://172.17.0.2:27017/instagramClone";

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const simulateFollow = async () => {
  try {
    // User ID of the current user (the follower)
    const currentUserId = '662c636135dee7748ab5189b'; // Test user ID
    // User ID of the user to follow
    const userToFollowId = '662b2a8810939c3a48aab1c5'; // Replace with a valid user ID to follow who has posts

    // Find the current user and the user to follow
    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userToFollowId);

    if (!currentUser || !userToFollow) {
      console.log('One of the users was not found');
      return;
    }

    // Add the user to follow to the current user's following list
    currentUser.following.push(userToFollowId);
    // Add the current user to the user to follow's followers list
    userToFollow.followers.push(currentUserId);

    // Save the updated users
    await currentUser.save();
    await userToFollow.save();

    console.log(`User ${currentUser.username} is now following ${userToFollow.username}`);
  } catch (error) {
    console.error('Error simulating follow:', error);
  }
};

simulateFollow();
