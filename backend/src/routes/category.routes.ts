import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require authentication to get user role for filtering
router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategoryById);

// Admin only routes
router.post('/', authenticate, createCategory);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
