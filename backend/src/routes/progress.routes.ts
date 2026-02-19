import { Router } from 'express';
import {
  getCategoryProgress,
  markTopicComplete,
  unmarkTopicComplete,
  getAllProgress
} from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

router.get('/all', getAllProgress);
router.get('/:categoryId', getCategoryProgress);
router.post('/complete', markTopicComplete);
router.delete('/complete', unmarkTopicComplete);

export default router;
