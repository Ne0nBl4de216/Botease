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
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-bots')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/bots', botRouter);

// Initialize Bot Manager
setupBotManager();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});