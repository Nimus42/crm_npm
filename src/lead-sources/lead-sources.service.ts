import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadSourceDto } from './dto/create-lead-source.dto';

@Injectable()
export class LeadSourcesService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadSourceDto: CreateLeadSourceDto) {
    const exists = await this.prisma.leadSource.findUnique({
      where: { name: createLeadSourceDto.name },
    });
    if (exists) throw new ConflictException('Такой источник уже существует');

    return this.prisma.leadSource.create({ data: createLeadSourceDto });
  }

  async findAll() {
    return this.prisma.leadSource.findMany();
  }

  async remove(id: string) {
    const source = await this.prisma.leadSource.findUnique({ where: { id } });
    if (!source) throw new NotFoundException('Источник не найден');

    return this.prisma.leadSource.delete({ where: { id } });
  }
}