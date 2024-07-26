import { Router } from 'express';
import { getCurrentPlans, getTransactions } from '../controllers/paymentInfo';
import { adminMiddleware } from "../middlewares/auth";
import { getPlanDetails } from '../controllers/planAnalytic';
import { getUserResourceDetails } from '../controllers/userAnalytic';

const router = Router();


router.get('/get-current-plans', adminMiddleware, getCurrentPlans);
router.get('/get-transactions', adminMiddleware, getTransactions);
router.get('/plan-analytics',adminMiddleware, getPlanDetails);
router.get('/user-analytics', adminMiddleware, getUserResourceDetails);

export default router;
