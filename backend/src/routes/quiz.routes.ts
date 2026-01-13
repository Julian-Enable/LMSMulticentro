import { Router } from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
} from '../controllers/quiz.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getQuizzes);
router.get('/:id', getQuizById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), createQuiz);
router.put('/:id', authenticate, authorize('ADMIN'), updateQuiz);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteQuiz);

export default router;
