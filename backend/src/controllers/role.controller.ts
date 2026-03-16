import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { BadRequestError } from '../errors/errors';

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isActiveQuery = req.query.isActive as string | undefined;
    const isActive = isActiveQuery !== undefined ? isActiveQuery === 'true' : undefined;

    const roles = await RoleService.getRoles(isActive);
    res.json(roles);
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const role = await RoleService.getRoleById(id);
    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, name } = req.body;
    if (!code || !name) throw new BadRequestError('Code and name are required');

    const role = await RoleService.createRole(req.body);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const role = await RoleService.updateRole(id, req.body);
    res.json(role);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await RoleService.deleteRole(id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    next(error);
  }
};
