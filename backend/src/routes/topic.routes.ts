import { Router } from 'express';
import {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getNextTopic,
  getPreviousTopic,
  incrementTopicViews
} from '../controllers/topic.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getTopics);
router.get('/:id', getTopicById);
router.get('/:id/next', getNextTopic);
router.get('/:id/previous', getPreviousTopic);
router.post('/:id/view', incrementTopicViews);

// Protected routes (Admin only)
router.post('/', authenticate, createTopic);
router.put('/:id', authenticate, updateTopic);
router.delete('/:id', authenticate, deleteTopic);

export default router;
