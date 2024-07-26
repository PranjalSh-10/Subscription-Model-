import { getResources, accessResource } from "../controllers/resource";
import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { ValidationMiddleware } from "../middlewares/validation";
import { accessResourceValidationSchema } from "../validations/schemas";

const router = express.Router();

router.get('/get-resources', authMiddleware, getResources);
router.post('/access-resource', ValidationMiddleware(accessResourceValidationSchema), authMiddleware, accessResource);

export default router;