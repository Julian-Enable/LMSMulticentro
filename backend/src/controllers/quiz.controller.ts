import { Request, Response } from 'express';
import prisma from '../config/database';

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const { topicId, isActive } = req.query;

    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(topicId && { topicId: topicId as string }),
        ...(isActive !== undefined && { isActive: isActive === 'true' })
      },
      include: {
        topic: {
          include: {
            video: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            video: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { topicId, question, options, correctAnswer, explanation, order, isActive } = req.body;

    if (!topicId || !question || !options || !Array.isArray(options) || correctAnswer === undefined) {
      return res.status(400).json({ message: 'TopicId, question, options array, and correctAnswer are required' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        topicId,
        question,
        options,
        correctAnswer,
        explanation,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        topic: true
      }
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { topicId, question, options, correctAnswer, explanation, order, isActive } = req.body;

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...(topicId && { topicId }),
        ...(question && { question }),
        ...(options && { options }),
        ...(correctAnswer !== undefined && { correctAnswer }),
        ...(explanation !== undefined && { explanation }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        topic: true
      }
    });

    res.json(quiz);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.quiz.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
