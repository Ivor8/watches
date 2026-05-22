import express from 'express';
import ChatMessage from '../models/ChatMessage.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ created_at: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.find({ session_id: sessionId }).sort({ created_at: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { session_id, sender, message } = req.body;
    
    const msg = new ChatMessage({
      session_id,
      sender: sender || 'customer',
      message,
    });
    
    await msg.save();
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
