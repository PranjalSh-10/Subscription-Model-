import { getResources, accessResource } from "../controllers/resources";
import express from "express";
import { authMiddleware } from "../middleware/auth";
import { ValidationMiddleware } from "../middleware/validation";
import { accessResourceValidationSchema } from "../validations/schemas";

const router = express.Router();

router.get('/get-resources', authMiddleware, getResources);
router.post('/access-resource', ValidationMiddleware(accessResourceValidationSchema), authMiddleware, accessResource);

export default router;