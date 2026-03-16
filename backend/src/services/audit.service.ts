import prisma from '../config/database';
import logger from '../config/logger';

export class AuditService {
  /**
   * Registra una acción en la base de datos de auditoría
   */
  static async log(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entity: string,
    entityId: string,
    userId: string,
    details?: any
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          action,
          entity,
          entityId,
          userId,
          details: details ? details : null,
        },
      });
    } catch (error) {
      // Solo registramos el error, no interrumpimos la ejecución porque la auditoría no debe bloquear
      // el flujo principal si llega a fallar.
      logger.error(`Error saving audit log for ${entity} ${entityId}:`, error);
    }
  }
}
