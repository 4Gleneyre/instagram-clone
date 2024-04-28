const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

const mongoURI = "mongodb://172.17.0.2:27017/instagramClone";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const queryTestUserAndPosts = async () => {
  try {
    // Find the test user by email
    const user = await User.findOne({ email: "jayfu03@gmail.com" }).populate('following');
    if (!user) {
      console.log('Test user not found');
      return;
    }
    console.log('Test user found:', user);
    console.log('Test user following list:', user.following);

    // Update the test user to follow existing users
    const usersToFollow = await User.find({ email: { $ne: "jayfu03@gmail.com" } });
    const usersToFollowIds = usersToFollow.map(u => u._id);
    user.following = usersToFollowIds;
    await user.save();
    console.log('Test user updated to follow existing users:', user.following);

    // Find all posts in the database
    const posts = await Post.find().populate('user', 'username');
    console.log('All posts in the database:', posts);

    // Find posts made by users that the test user is following
    const followingPosts = await Post.find({ user: { $in: user.following } }).populate('user', 'username');
    console.log('Posts made by users that the test user is following:', followingPosts);

    // Query for the specific post by ID
    const specificPost = await Post.findById("662d7599bcf7abb4e9b28a8e");
    console.log('Specific post queried by ID:', specificPost);
  } catch (error) {
    console.error('Error querying test user and posts:', error);
  } finally {
    mongoose.disconnect();
  }
};

queryTestUserAndPosts();
