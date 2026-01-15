import { Request, Response } from 'express';
import prisma from '../config/database';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;

    const roles = await prisma.role.findMany({
      where: isActive !== undefined ? { isActive: isActive === 'true' } : {},
      orderBy: [
        { isSystem: 'desc' }, // System roles first
        { name: 'asc' }
      ]
    });

    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id: String(id) },
      include: {
        _count: {
          select: {
            users: true,
            categoryRoles: true
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { code, name, description, color, isActive } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: 'Code and name are required' });
    }

    // Check if code already exists
    const existing = await prisma.role.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existing) {
      return res.status(400).json({ message: 'Role code already exists' });
    }

    const role = await prisma.role.create({
      data: {
        code: code.toUpperCase(),
        name,
        description,
        color: color || '#3B82F6',
        isActive: isActive !== undefined ? isActive : true,
        isSystem: false
      }
    });

    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, description, color, isActive } = req.body;

    // Check if role exists and is not system role
    const existing = await prisma.role.findUnique({
      where: { id: String(id) }
    });

    if (!existing) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (existing.isSystem && code && code !== existing.code) {
      return res.status(400).json({ message: 'Cannot change code of system role' });
    }

    const role = await prisma.role.update({
      where: { id: String(id) },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(color && { color }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id: String(id) },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (role.isSystem) {
      return res.status(400).json({ message: 'Cannot delete system role' });
    }

    if (role._count.users > 0) {
      return res.status(400).json({ 
        message: `Cannot delete role with ${role._count.users} assigned users. Reassign users first.` 
      });
    }

    await prisma.role.delete({
      where: { id: String(id) }
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
