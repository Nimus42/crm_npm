import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// 1. База данных и Авторизация
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// 2. Ядро CRM
import { ClientsModule } from './clients/clients.module';
import { LeadSourcesModule } from './lead-sources/lead-sources.module';
import { ActionLogsModule } from './action-logs/action-logs.module';

// 3. Воронка, Проекты и Задачи
import { FunnelModule } from './funnel/funnel.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

// 4. LMS и Интеграции (если ты уже создал эти папки для этапов 4 и 5)
// import { LmsModule } from './lms/lms.module';
// import { TelegramModule } from './telegram/telegram.module';
// import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    UsersModule,
    AuthModule,
    
    ClientsModule,
    LeadSourcesModule,
    ActionLogsModule,
    
    FunnelModule,
    ProjectsModule,
    TasksModule,
    
    // Раскомментируй следующие строки, когда добавишь код для LMS и Telegram
    // LmsModule,
    // TelegramModule,
    // NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}