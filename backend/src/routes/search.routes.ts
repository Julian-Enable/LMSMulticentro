import { Router } from 'express';
import { searchContent } from '../controllers/search.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected - requires authentication
router.get('/', authenticate, searchContent);

export default router;
