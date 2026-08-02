import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(managerId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        description: dto.description,
        deadline: new Date(dto.deadline),
        managerId,
        clientId: dto.clientId,
      },
    });
  }

  async getManagerTasks(managerId: string) {
    return this.prisma.task.findMany({
      where: { managerId },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { deadline: 'asc' },
    });
  }

  async updateTaskStatus(taskId: string, managerId: string, status: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, managerId },
    });
    
    if (!task) throw new NotFoundException('Задача не найдена или нет доступа');

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }
}