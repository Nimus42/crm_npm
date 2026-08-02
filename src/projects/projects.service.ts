import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProjectAutomatically(clientId: string, managerId: string, clientName: string) {
    const existingProject = await this.prisma.project.findUnique({ where: { clientId } });
    if (existingProject) return existingProject;

    return this.prisma.project.create({
      data: {
        name: `Проект для клиента: ${clientName}`,
        clientId,
        managerId,
        status: 'IN_PROGRESS',
      },
    });
  }

  async addExpense(projectId: string, createExpenseDto: CreateExpenseDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Проект не найден');
    if (project.status === 'COMPLETED') throw new BadRequestException('Проект уже завершен');

    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        projectId,
      },
    });
  }

  async closeProject(projectId: string, revenue: number) {
    const project = await this.prisma.project.findUnique({ 
      where: { id: projectId },
      include: { expenses: true } 
    });

    if (!project) throw new NotFoundException('Проект не найден');
    if (project.status === 'COMPLETED') throw new BadRequestException('Проект уже завершен');

    const totalExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = revenue - totalExpenses;
    
    // Менеджер получает бонус 10% от чистой прибыли, но бонус не может быть отрицательным
    const managerBonus = netProfit > 0 ? netProfit * 0.10 : 0;

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'COMPLETED',
        revenue,
        netProfit,
        managerBonus,
      },
    });
  }

  async getProjectDetails(projectId: string) {
    return this.prisma.project.findUnique({
      where: { id: projectId },
      include: { expenses: true, manager: { select: { email: true, id: true } } },
    });
  }
}