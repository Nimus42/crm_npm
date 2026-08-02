import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActionLogsService {
  constructor(private prisma: PrismaService) {}

  async findLogsByEntity(entityId: string) {
    return this.prisma.actionLog.findMany({
      where: { entityId },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}