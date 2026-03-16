import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from '../validators/category.validator';

const router = Router();

// Protected routes - require authentication to get user role for filtering
router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, validateRequest(categoryIdSchema), getCategoryById);

// Rutas protegidas
router.post('/', authenticate, validateRequest(createCategorySchema), createCategory);
router.put('/:id', authenticate, validateRequest(updateCategorySchema), updateCategory);
router.delete('/:id', authenticate, validateRequest(categoryIdSchema), deleteCategory);

export default router;
