import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(title: string, description?: string) {
    return this.prisma.course.create({
      data: { title, description },
    });
  }

  async addQuestionToCourse(courseId: string, text: string, options: string[], correctOptionIndex: number) {
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      throw new BadRequestException('Индекс правильного ответа выходит за пределы массива options');
    }

    return this.prisma.question.create({
      data: {
        text,
        options,
        correctOptionIndex,
        courseId,
      },
    });
  }

  // Методы создания модулей и уроков опущены для лаконичности
}