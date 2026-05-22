import express from 'express';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/', authMiddleware, authController.createAdmin);
router.get('/', authMiddleware, authController.getAdmins);
router.delete('/:id', authMiddleware, authController.deleteAdmin);
router.put('/:id', authMiddleware, authController.updateAdmin);

export default router;
