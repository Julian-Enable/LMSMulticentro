import { Request, Response, NextFunction } from 'express';
import { VideoService } from '../services/video.service';

export const getVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const isActiveQuery = req.query.isActive as string | undefined;
    const isActive = isActiveQuery !== undefined ? isActiveQuery === 'true' : undefined;

    const videos = await VideoService.getVideos(categoryId, isActive);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const getVideoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const video = await VideoService.getVideoById(id);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await VideoService.createVideo(req.body);
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const video = await VideoService.updateVideo(id, req.body);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await VideoService.deleteVideo(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createVideoBundle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await VideoService.createVideoBundle(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
