import { Router } from 'express';
import { login, register, getProfile, makeAdmin, changePassword, refresh, logout, logoutAll } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { loginSchema, registerSchema, refreshTokenSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);
router.post('/refresh', validateRequest(refreshTokenSchema), refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);
router.get('/profile', authenticate, getProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/make-admin', authenticate, makeAdmin); // Temporal - requiere auth

export default router;
