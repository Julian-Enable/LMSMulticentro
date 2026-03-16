import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/quiz.service';
import { BadRequestError } from '../errors/errors';

export const getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topicId = req.query.topicId as string | undefined;
    const isActiveQuery = req.query.isActive as string | undefined;
    const isActive = isActiveQuery !== undefined ? isActiveQuery === 'true' : undefined;

    const quizzes = await QuizService.getQuizzes(topicId, isActive);
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const quiz = await QuizService.getQuizById(id);
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId, question, options, correctAnswer } = req.body;

    if (!topicId || !question || !options || !Array.isArray(options) || correctAnswer === undefined) {
      throw new BadRequestError('TopicId, question, options array, and correctAnswer are required');
    }

    const quiz = await QuizService.createQuiz(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const quiz = await QuizService.updateQuiz(id, req.body);
    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await QuizService.deleteQuiz(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
