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

// Protected routes - require authentication
router.get('/', authenticate, getTopics);
router.get('/:id', authenticate, getTopicById);
router.get('/:id/next', authenticate, getNextTopic);
router.get('/:id/previous', authenticate, getPreviousTopic);
router.post('/:id/view', authenticate, incrementTopicViews);

// Admin only routes
router.post('/', authenticate, createTopic);
router.put('/:id', authenticate, updateTopic);
router.delete('/:id', authenticate, deleteTopic);

export default router;
