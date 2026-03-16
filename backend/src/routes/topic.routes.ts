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
import { validateRequest } from '../middleware/validation.middleware';
import { createTopicSchema, updateTopicSchema, topicIdSchema } from '../validators/topic.validator';

const router = Router();

// Protected routes - require authentication
router.get('/', authenticate, getTopics);
// router.get('/video/:videoId', authenticate, getTopicsByVideo); // removed if it doesn't exist
router.get('/:id', authenticate, validateRequest(topicIdSchema), getTopicById);
router.get('/:id/next', authenticate, getNextTopic);
router.get('/:id/previous', authenticate, getPreviousTopic);
router.post('/:id/view', authenticate, incrementTopicViews);

// Rutas de administración protegidas
router.post('/', authenticate, validateRequest(createTopicSchema), createTopic);
router.put('/:id', authenticate, validateRequest(updateTopicSchema), updateTopic);
router.delete('/:id', authenticate, validateRequest(topicIdSchema), deleteTopic);

export default router;
