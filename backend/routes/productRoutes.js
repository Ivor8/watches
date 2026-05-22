import express from 'express';
import * as productController from '../controllers/productController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/by-handle/:handle', productController.getProductByHandle);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, upload.any(), productController.createProduct);
router.put('/:id', authMiddleware, upload.any(), productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

export default router;
