import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { LeadSourcesService } from './lead-sources.service';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lead-sources')
export class LeadSourcesController {
  constructor(private readonly leadSourcesService: LeadSourcesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createLeadSourceDto: CreateLeadSourceDto) {
    return this.leadSourcesService.create(createLeadSourceDto);
  }

  @Roles(Role.ADMIN, Role.HEAD_SALES, Role.MANAGER)
  @Get()
  findAll() {
    return this.leadSourcesService.findAll();
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leadSourcesService.remove(id);
  }
}