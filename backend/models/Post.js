import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true,
    max: 2200
  },
  likes: {
    type: Array,
    default: []
  },
  comments: {
    type: Array,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Post', postSchema);
