import express from 'express';
import { Bot } from '../models/Bot.js';
import { deployBot, updateBotStatus } from '../services/botManager.js';

const router = express.Router();

// Get all bots
router.get('/', async (req, res) => {
  try {
    const bots = await Bot.find({}, { token: 0 });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deploy new bot
router.post('/deploy', async (req, res) => {
  try {
    const { token, status } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const bot = await deployBot(token, status, ip);
    res.json({ success: true, botId: bot._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update bot status
router.put('/:botId/status', async (req, res) => {
  try {
    const { botId } = req.params;
    const { status } = req.body;
    await updateBotStatus(botId, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const botRouter = router;