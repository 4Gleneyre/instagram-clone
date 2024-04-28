import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();

// MongoDB URI
const dbURI = "mongodb://172.17.0.2:27017/instagramClone";

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// Middleware
const corsOptions = {
  origin: ['https://jolly-choux-3ae1be.netlify.app', 'https://777a044eb87f.ngrok.app'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Multer middleware for handling multipart/form-data
const upload = multer({ dest: 'uploads/' });
app.use(upload.any());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Set up __dirname for ES Modules
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  console.log(`Current working directory: ${path.resolve(__dirname)}`);
});
