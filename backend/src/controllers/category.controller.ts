import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CategoryService } from '../services/category.service';

export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
    const admin = req.query.admin === 'true';
    const userRoleId = req.user?.roleId;

    const categories = await CategoryService.getCategories(isActive, admin, userRoleId);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.getCategoryById(id);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.updateCategory(id, req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await CategoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
