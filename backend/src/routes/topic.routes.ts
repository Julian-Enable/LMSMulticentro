import { Router } from 'express';
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getNextTopic,
  getPreviousTopic
} from '../controllers/topic.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getTopics);
router.get('/:id', getTopicById);
router.get('/:id/next', getNextTopic);
router.get('/:id/previous', getPreviousTopic);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), createTopic);
router.put('/:id', authenticate, authorize('ADMIN'), updateTopic);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTopic);

export default router;
