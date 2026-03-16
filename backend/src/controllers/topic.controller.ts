import { Request, Response, NextFunction } from 'express';
import { TopicService } from '../services/topic.service';

export const getTopics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videoId = req.query.videoId as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const isActiveQuery = req.query.isActive as string | undefined;
    const isActive = isActiveQuery !== undefined ? isActiveQuery === 'true' : undefined;

    const topics = await TopicService.getTopics(videoId, categoryId, isActive);
    res.json(topics);
  } catch (error) {
    next(error);
  }
};

export const getTopicById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const topic = await TopicService.getTopicById(id);
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

export const createTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topic = await TopicService.createTopic(req.body);
    res.status(201).json(topic);
  } catch (error) {
    next(error);
  }
};

export const updateTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const topic = await TopicService.updateTopic(id, req.body);
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

export const deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await TopicService.deleteTopic(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getNextTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const topic = await TopicService.getNextTopic(id);
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

export const getPreviousTopic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const topic = await TopicService.getPreviousTopic(id);
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

export const incrementTopicViews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const topic = await TopicService.incrementTopicViews(id);
    res.json(topic);
  } catch (error) {
    next(error);
  }
};
