import { Request, Response } from 'express';
import prisma from '../config/database';

export const searchContent = async (req: Request, res: Response) => {
  try {
    const { q, category, page = '1', limit = '20' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const searchTerms = q.toLowerCase().split(' ').filter(term => term.length > 0);

    // Búsqueda en temas
    const whereClause: any = {
      isActive: true,
      OR: searchTerms.flatMap(term => [
        { code: { contains: term, mode: 'insensitive' } },
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        {
          tags: {
            some: {
              tag: {
                name: { contains: term, mode: 'insensitive' }
              }
            }
          }
        }
      ])
    };

    // Filtrar por categoría si se proporciona
    if (category) {
      whereClause.video = {
        categoryId: category as string
      };
    }

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where: whereClause,
        include: {
          video: {
            include: {
              category: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          quizzes: {
            where: { isActive: true },
            select: { id: true }
          }
        },
        orderBy: { code: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.topic.count({ where: whereClause })
    ]);

    // Calcular relevancia (cuántos términos coinciden)
    const topicsWithRelevance = topics.map(topic => {
      let relevance = 0;
      const searchableText = [
        topic.code,
        topic.title,
        topic.description || '',
        ...topic.tags.map(t => t.tag.name)
      ].join(' ').toLowerCase();

      searchTerms.forEach(term => {
        if (searchableText.includes(term)) {
          relevance++;
        }
      });

      return { ...topic, relevance };
    });

    // Ordenar por relevancia
    topicsWithRelevance.sort((a, b) => b.relevance - a.relevance);

    res.json({
      results: topicsWithRelevance,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
