import { Request, Response, NextFunction } from 'express';
import { TagService } from '../services/tag.service';
import { BadRequestError } from '../errors/errors';

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagsWithCount = await TagService.getTags();
    res.json(tagsWithCount);
  } catch (error) {
    next(error);
  }
};

export const getTagById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const tag = await TagService.getTagById(id);
    res.json(tag);
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name) throw new BadRequestError('Name is required');

    const tag = await TagService.createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

export const updateTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;
    if (!name) throw new BadRequestError('Name is required');

    const tag = await TagService.updateTag(id, name);
    res.json(tag);
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await TagService.deleteTag(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
