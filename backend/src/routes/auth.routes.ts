import { Router } from 'express';
import { login, register, getProfile, makeAdmin } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getProfile);
router.post('/make-admin', makeAdmin); // Temporal

export default router;
