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

// All quiz routes require authentication
router.use(authenticate);

router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/', createQuiz);
router.put('/:id', updateQuiz);
router.delete('/:id', authenticate, deleteQuiz);

export default router;
