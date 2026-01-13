import { Router } from 'express';
import {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tag.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getTags);
router.get('/:id', getTagById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), createTag);
router.put('/:id', authenticate, authorize('ADMIN'), updateTag);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTag);

export default router;
