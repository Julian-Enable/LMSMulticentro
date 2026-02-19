import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication (Admin only)
router.get('/', authenticate, getUsers);
router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
