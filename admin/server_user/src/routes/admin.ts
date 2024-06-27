import { Router } from 'express';
import { createPlan, updatePlan, deletePlan, getPlans,getPlan } from '../controllers/admin';
import { getPaymentHistory } from '../controllers/paymentInfo';

import { adminMiddleware } from "../middlewares/admin";
import { adminLogin } from '../controllers/adminLogin';

const router = Router();

router.post('/login', adminLogin);
router.post('/manage-subscription',adminMiddleware, createPlan);
router.put('/manage-subscription/:id',adminMiddleware , updatePlan);
router.delete('/manage-subscription/:id',adminMiddleware,  deletePlan);
router.get('/manage-subscription/:id', adminMiddleware, getPlan);
router.get('/manage-subscription',adminMiddleware ,getPlans);
router.get('/get-payment-info', adminMiddleware, getPaymentHistory);
 
export default router;
