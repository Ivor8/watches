import express from 'express';
import * as collectionController from '../controllers/collectionController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', collectionController.getAllCollections);
router.get('/:handle', collectionController.getCollectionByHandle);
router.post('/', authMiddleware, collectionController.createCollection);
router.put('/:id', authMiddleware, collectionController.updateCollection);
router.delete('/:id', authMiddleware, collectionController.deleteCollection);

export default router;
