import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot!: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (token) {
      this.bot = new Telegraf(token);
    }
  }

  async onModuleInit() {
    if (this.bot) {
      this.bot.start((ctx) => {
        ctx.reply(`Ваш Chat ID: ${ctx.chat.id}. Добавьте его в свой профиль CRM для получения уведомлений.`);
      });
      this.bot.launch();
      this.logger.log('Telegram Bot успешно запущен');
    }
  }

  async sendMessage(chatId: string, message: string) {
    if (!this.bot || !chatId) return;
    try {
      await this.bot.telegram.sendMessage(chatId, message, { parse_mode: 'HTML' });
    } catch (error: any) {
      this.logger.error(`Ошибка при отправке сообщения в Telegram (${chatId}): ${error.message}`);
    }
  }

  async notifyNewLead(chatId: string, clientName: string, phone: string, source: string) {
    const message = `🚀 <b>Новый лид!</b>\n\n👤 Имя: ${clientName}\n📞 Телефон: ${phone}\n🔗 Источник: ${source}\n\nСвяжитесь с клиентом как можно скорее!`;
    await this.sendMessage(chatId, message);
  }

  async notifyNewDeal(chatId: string, projectName: string, revenue: number) {
    const message = `💰 <b>Новая сделка (Проект создан)!</b>\n\n📁 Проект: ${projectName}\n💵 Сумма: ${revenue}\n\nОтличная работа!`;
    await this.sendMessage(chatId, message);
  }

  async notifySecurityWarning(chatId: string, email: string, ip: string) {
    const message = `⚠️ <b>Предупреждение безопасности</b>\n\nЗафиксированы подозрительные попытки входа в аккаунт <b>${email}</b>.\n🌐 IP-адрес: ${ip}\nАккаунт временно заблокирован.`;
    await this.sendMessage(chatId, message);
  }
}