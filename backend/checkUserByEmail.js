const mongoose = require('mongoose');
const User = require('./models/User');

// MongoDB URI
const dbURI = "mongodb://172.17.0.2:27017/instagramClone";

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const checkUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('No user found with email:', email);
    }
  } catch (error) {
    console.error('Error finding user by email:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Replace with the actual test email
checkUserByEmail('jayfu03@gmail.com');
