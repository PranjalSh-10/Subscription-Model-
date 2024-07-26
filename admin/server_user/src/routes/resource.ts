import { Router } from "express";
import { getPlanResources, getResources } from "../controllers/resource"
import { adminMiddleware } from "../middlewares/auth"

const router = Router();

router.get('/get-resources', adminMiddleware, getResources)
router.get('/get-plan-resources/:id', adminMiddleware, getPlanResources)

export default router;