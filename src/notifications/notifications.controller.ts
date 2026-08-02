import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getUserNotifications(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).sub;
    return this.notificationsService.markAsRead(id, userId);
  }
}