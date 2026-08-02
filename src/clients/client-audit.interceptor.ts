import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ClientAuditInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.user['sub'];
    const method = req.method;
    const clientId = req.params.id as string;
        
    let oldData = null;

    if (['PATCH', 'PUT', 'DELETE'].includes(method) && clientId) {
      oldData = await this.prisma.client.findUnique({ where: { id: clientId } });
    }

    return next.handle().pipe(
      tap(async (newData) => {
        if (!userId || !newData) return;

        let action = 'UPDATE';
        if (method === 'POST') action = 'CREATE';
        if (method === 'DELETE') action = 'DELETE';

        const targetId = clientId || newData.id;
        
        if (targetId) {
          await this.prisma.actionLog.create({
            data: {
              entityName: 'Client',
              entityId: targetId,
              action,
              oldData: oldData ? (oldData as any) : undefined,
              newData: method === 'DELETE' ? undefined : (newData as any),
              userId,
            },
          });
        }
      }),
    );
  }
}