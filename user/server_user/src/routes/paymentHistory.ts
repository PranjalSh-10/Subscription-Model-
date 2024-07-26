import express from 'express';
import { getPaymentHistory } from '../controllers/paymentHistory';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/payment-history', authMiddleware, getPaymentHistory);

export default router;
