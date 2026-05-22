import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', authMiddleware, settingsController.updateSettings);

export default router;
