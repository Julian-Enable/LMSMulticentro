import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        topics: {
          select: { topicId: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    const tagsWithCount = tags.map((tag: any) => ({
      ...tag,
      topicCount: tag.topics.length,
      topics: undefined
    }));

    res.json(tagsWithCount);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id: String(id) },
      include: {
        topics: {
          include: {
            topic: {
              include: {
                video: {
                  include: {
                    category: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const tag = await prisma.tag.create({
      data: { name }
    });

    res.status(201).json(tag);
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const tag = await prisma.tag.update({
      where: { id: String(id) },
      data: { name }
    });

    res.json(tag);
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.tag.delete({
      where: { id: String(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
