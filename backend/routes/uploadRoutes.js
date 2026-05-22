import express from 'express';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', authMiddleware, upload.any(), uploadFile);
router.delete('/', authMiddleware, deleteFile);

export default router;
