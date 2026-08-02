import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService
  ) {}

  async create(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: createClientDto,
    });
  }

  async findAll() {
    return this.prisma.client.findMany({
      include: { source: true, manager: true, stage: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { source: true, manager: true, stage: true },
    });
    
    if (!client) throw new NotFoundException('Клиент не найден');
    
    return client;
  }

  async update(id: string, updateClientDto: Partial<CreateClientDto>) {
    // Получаем текущего клиента до обновления, чтобы проверить старый статус
    const client = await this.prisma.client.findUnique({ 
      where: { id },
      include: { stage: true }
    });
    
    if (!client) throw new NotFoundException('Клиент не найден');

    // Обновляем данные клиента
    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: updateClientDto,
      include: { stage: true, source: true, manager: true }
    });

    // Бизнес-логика: автоматическое создание проекта при переходе в статус "Оплачено"
    // Проверяем либо по названию стадии в FunnelStage, либо по строковому status
    const isNowPaid = updatedClient.stage?.name === 'Оплачено' || updatedClient.status === 'Оплачено';
    const wasNotPaid = client.stage?.name !== 'Оплачено' && client.status !== 'Оплачено';

    // Если статус сменился на "Оплачено" только что, создаем проект
    if (isNowPaid && wasNotPaid && updatedClient.managerId) {
      await this.projectsService.createProjectAutomatically(
        updatedClient.id, 
        updatedClient.managerId, 
        updatedClient.name
      );
    }

    return updatedClient;
  }
  
  async remove(id: string) {
    await this.findOne(id); // Проверяем, существует ли клиент
    
    return this.prisma.client.delete({
      where: { id },
    });
  }
}