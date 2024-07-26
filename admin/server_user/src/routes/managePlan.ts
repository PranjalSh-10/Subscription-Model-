import { Router } from 'express';
import { createPlan, updatePlan, deletePlan, getPlans,getPlan } from '../controllers/managePlan';
import { adminMiddleware } from "../middlewares/auth";
import { adminLogin } from '../controllers/login';
import { ValidationMiddleware } from '../middlewares/validation';
import { planValidationSchema } from '../validations/schemas';

const router = Router();

router.post('/login', adminLogin);

router.post('/manage-subscription',adminMiddleware, ValidationMiddleware(planValidationSchema), createPlan);
router.put('/manage-subscription/:id',adminMiddleware, ValidationMiddleware(planValidationSchema), updatePlan);
router.delete('/manage-subscription/:id',adminMiddleware,deletePlan);
router.get('/manage-subscription/:id', adminMiddleware,getPlan);
router.get('/manage-subscription',adminMiddleware ,getPlans);

export default router;
