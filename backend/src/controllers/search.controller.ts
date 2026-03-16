import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export const searchContent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    const category = req.query.category as string | undefined;
    const pageNum = parseInt(req.query.page as string || '1');
    const limitNum = parseInt(req.query.limit as string || '20');

    const result = await SearchService.searchContent(q, category, pageNum, limitNum);
    res.json(result);
  } catch (error) {
    next(error);
  }
};