import { Router } from 'express';
import { getPlans } from '../controllers/plans';
import { getCurrentPlan} from '../controllers/plans';
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get('/subscription-plans', getPlans);
router.get('/current-plan-details',authMiddleware,getCurrentPlan);

export default router;
