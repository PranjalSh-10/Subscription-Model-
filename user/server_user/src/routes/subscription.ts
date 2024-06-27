import express from 'express';
import { subscribe } from '../controllers/subscription';
import { unsubscribe } from '../controllers/subscription';
import { authMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { subscribeValidationSchema, unsubscribeValidationSchema } from '../validations/schemas';
const router = express.Router();

router.post('/subscribe', ValidationMiddleware(subscribeValidationSchema), authMiddleware, subscribe);
router.post('/unsubscribe', ValidationMiddleware(unsubscribeValidationSchema), authMiddleware, unsubscribe);

export default router;
