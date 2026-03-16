import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../errors/errors';

export class QuizService {
  static async getQuizzes(topicId?: string, isActive?: boolean) {
    return await prisma.quiz.findMany({
      where: {
        ...(topicId && { topicId }),
        ...(isActive !== undefined && { isActive })
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
  }

  static async getQuizById(id: string) {
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

    if (!quiz) throw new NotFoundError('Quiz');
    return quiz;
  }

  static async createQuiz(data: any) {
    return await prisma.quiz.create({
      data: {
        topicId: data.topicId,
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      },
      include: {
        topic: true
      }
    });
  }

  static async updateQuiz(id: string, data: any) {
    const exists = await prisma.quiz.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Quiz');

    return await prisma.quiz.update({
      where: { id },
      data: {
        ...(data.topicId && { topicId: data.topicId }),
        ...(data.question && { question: data.question }),
        ...(data.options && { options: data.options }),
        ...(data.correctAnswer !== undefined && { correctAnswer: data.correctAnswer }),
        ...(data.explanation !== undefined && { explanation: data.explanation }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      },
      include: {
        topic: true
      }
    });
  }

  static async deleteQuiz(id: string) {
    const exists = await prisma.quiz.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Quiz');

    await prisma.quiz.delete({
      where: { id }
    });
  }
}
