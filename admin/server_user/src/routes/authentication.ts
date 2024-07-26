import { Router } from 'express';
import { adminLogin } from '../controllers/login';
import { ValidationMiddleware } from '../middlewares/validation';
import { loginValidationSchema } from '../validations/schemas';

const router = Router();

router.post('/login', ValidationMiddleware(loginValidationSchema), adminLogin);

export default router;
