import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema, userIdSchema } from '../validators/user.validator';

const router = Router();

router.get('/', authenticate, getUsers);
router.post('/', authenticate, validateRequest(createUserSchema), createUser);
router.put('/:id', authenticate, validateRequest(updateUserSchema), updateUser);
router.delete('/:id', authenticate, validateRequest(userIdSchema), deleteUser);

export default router;
