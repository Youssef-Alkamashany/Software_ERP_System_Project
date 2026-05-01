import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restockProduct,
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public (no auth) — frontend can read products
router.get('/',     getAllProducts);
router.get('/:id',  getProductById);

// Protected
router.post('/',              authenticate, authorize('admin'), createProduct);
router.put('/:id',            authenticate, authorize('admin'), updateProduct);
router.delete('/:id',         authenticate, authorize('admin'), deleteProduct);
router.patch('/:id/restock',  authenticate, authorize('admin', 'warehouse'), restockProduct);

export default router;
