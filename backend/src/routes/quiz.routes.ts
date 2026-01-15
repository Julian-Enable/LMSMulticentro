import { Router } from 'express';
import {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz
} from '../controllers/quiz.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getQuizzes);
router.get('/:id', getQuizById);

// Protected routes (Admin only)
router.post('/', authenticate, createQuiz);
router.put('/:id', authenticate, updateQuiz);
router.delete('/:id', authenticate, deleteQuiz);

export default router;
