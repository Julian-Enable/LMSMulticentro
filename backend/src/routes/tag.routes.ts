import { Router } from 'express';
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tag.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getTags);
router.get('/:id', getTagById);

// Protected routes (Admin only)
router.post('/', authenticate, createTag);
router.put('/:id', authenticate, updateTag);
router.delete('/:id', authenticate, deleteTag);

export default router;
