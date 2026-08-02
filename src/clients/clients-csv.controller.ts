import { Controller, Get, Post, UseGuards, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { ClientsCsvService } from './clients-csv.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients/csv')
export class ClientsCsvController {
  constructor(private readonly clientsCsvService: ClientsCsvService) {}

  @Roles(Role.ADMIN, Role.HEAD_SALES)
  @Get('export')
  async exportCsv(@Res() res: Response) {
    const csvData = await this.clientsCsvService.exportClientsToCsv();
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="clients_export.csv"');
    
    // Добавляем BOM для корректного отображения кириллицы в Excel
    res.send('\uFEFF' + csvData);
  }

  @Roles(Role.ADMIN, Role.HEAD_SALES)
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: any, @Req() req: Request) {
    if (!file) {
      throw new Error('Файл не загружен');
    }
    const managerId = req.user['sub'];
    return this.clientsCsvService.importClientsFromCsv(file.buffer, managerId);
  }
}