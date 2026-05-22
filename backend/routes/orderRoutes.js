import express from 'express';
import * as orderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, orderController.getAllOrders);
router.get('/stats/dashboard', authMiddleware, orderController.getDashboardStats);
router.get('/customer', orderController.getOrdersByCustomerEmail);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.delete('/:id', authMiddleware, orderController.deleteOrder);

export default router;
