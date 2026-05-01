import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/',           authenticate, authorize('admin', 'cashier'), getAllOrders);
router.get('/:id',        authenticate, authorize('admin', 'cashier'), getOrderById);
router.post('/',          authenticate, createOrder);
router.patch('/:id/cancel', authenticate, authorize('admin'), cancelOrder);

export default router;
