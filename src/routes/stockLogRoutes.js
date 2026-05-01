import { Router } from 'express';
import { getStockLogs } from '../controllers/stockLogController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'warehouse'), getStockLogs);

export default router;
