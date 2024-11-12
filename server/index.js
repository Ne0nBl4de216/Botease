import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { botRouter } from './routes/botRoutes.js';
import { setupBotManager } from './services/botManager.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://heroic-trifle-017002.netlify.app',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/bots', botRouter);

// Initialize Bot Manager
setupBotManager();

// Listen on all interfaces (0.0.0.0) to ensure it's accessible on Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});