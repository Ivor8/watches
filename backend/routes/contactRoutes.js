import express from 'express';
import * as contactController from '../controllers/contactController.js';

const router = express.Router();

router.post('/', contactController.createContactMessage);

export default router;
