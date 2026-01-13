import { Router } from 'express';
import { searchContent } from '../controllers/search.controller';

const router = Router();

// Public search route
router.get('/', searchContent);

export default router;
