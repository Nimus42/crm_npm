import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(userId: string, title: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, title, message },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    
    if (!notification) throw new NotFoundException('Уведомление не найдено');

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}