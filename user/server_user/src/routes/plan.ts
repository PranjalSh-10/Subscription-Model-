import { Router } from 'express';
import { getPlans } from '../controllers/plan';
import { getCurrentPlan} from '../controllers/plan';
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.get('/subscription-plans', getPlans);
router.get('/current-plan-details',authMiddleware,getCurrentPlan);

export default router;
