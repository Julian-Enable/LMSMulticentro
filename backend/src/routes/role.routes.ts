import express from 'express';
import { getRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/role.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getRoles);
router.get('/:id', authMiddleware, getRoleById);
router.post('/', authMiddleware, createRole);
router.put('/:id', authMiddleware, updateRole);
router.delete('/:id', authMiddleware, deleteRole);

export default router;
