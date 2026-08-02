import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsCsvService {
  constructor(private prisma: PrismaService) {}

  // Генерация CSV на лету
  async exportClientsToCsv(): Promise<string> {
    const clients = await this.prisma.client.findMany({
      include: { source: true, manager: true },
    });

    const header = ['ID', 'Имя', 'Телефон', 'WhatsApp', 'Telegram', 'Email', 'Компания', 'Город', 'Статус', 'Источник', 'Менеджер', 'Дата_создания'];
    
    const rows = clients.map(client => [
      client.id,
      this.escapeCsvField(client.name),
      this.escapeCsvField(client.phone),
      this.escapeCsvField(client.whatsapp || ''),
      this.escapeCsvField(client.telegram || ''),
      this.escapeCsvField(client.email || ''),
      this.escapeCsvField(client.company || ''),
      this.escapeCsvField(client.city || ''),
      this.escapeCsvField(client.status),
      this.escapeCsvField(client.source?.name || ''),
      this.escapeCsvField(client.manager?.email || ''),
      client.createdAt.toISOString()
    ]);

    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  }

  // Парсинг CSV и импорт
  async importClientsFromCsv(csvBuffer: Buffer, managerId: string) {
    const csvString = csvBuffer.toString('utf8');
    const lines = csvString.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length <= 1) {
      throw new BadRequestException('CSV файл пуст или содержит только заголовки');
    }

    const newClients = [];
    // Пропускаем первую строку (заголовки)
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map(col => col.replace(/^"|"$/g, '').trim());
      
      // Минимальная валидация (имя и телефон обязательны)
      if (columns.length >= 3 && columns[1] && columns[2]) {
        newClients.push({
          name: columns[1],
          phone: columns[2],
          whatsapp: columns[3] || null,
          telegram: columns[4] || null,
          email: columns[5] || null,
          company: columns[6] || null,
          city: columns[7] || null,
          status: 'Новый лид',
          managerId,
        });
      }
    }

    if (newClients.length === 0) {
      throw new BadRequestException('Не найдено валидных данных для импорта');
    }

    const created = await this.prisma.client.createMany({
      data: newClients,
      skipDuplicates: true,
    });

    return { importedCount: created.count };
  }

  private escapeCsvField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}