import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FunnelService {
  constructor(private prisma: PrismaService) {}

  async createStage(name: string, order: number) {
    return this.prisma.funnelStage.create({
      data: { name, order },
    });
  }

  async getAllStages() {
    return this.prisma.funnelStage.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async updateStage(id: string, name: string, order: number) {
    return this.prisma.funnelStage.update({
      where: { id },
      data: { name, order },
    });
  }
}