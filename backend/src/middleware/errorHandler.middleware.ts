import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import logger from '../config/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, { code: err.code, details: err.details, stack: err.stack });
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Fallback if err is a generic error without specific code/details
  const errorObj = err as any;
  const message = errorObj.message || 'Error interno del servidor';
  const stack = errorObj.stack;

  // Errores no controlados (500)
  logger.error(`Unhandled Error: ${message}`, { stack });
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack })
  });
};
