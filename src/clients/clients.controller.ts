import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientAuditInterceptor } from './client-audit.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseInterceptors(ClientAuditInterceptor)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ClientAuditInterceptor)
  update(@Param('id') id: string, @Body() updateClientDto: Partial<CreateClientDto>) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @UseInterceptors(ClientAuditInterceptor)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}