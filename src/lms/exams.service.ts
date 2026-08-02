import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitExamDto } from './dto/submit-exam.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  // Генерация 20 случайных вопросов
  async generateExam(courseId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Курс не найден');

    const allQuestions = await this.prisma.question.findMany({ where: { courseId } });
    
    if (allQuestions.length < 20) {
      throw new BadRequestException('В базе недостаточно вопросов для формирования экзамена (минимум 20)');
    }

    // Алгоритм случайного перемешивания Фишера-Йетса
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 20);

    // Удаляем correctOptionIndex перед отправкой ученику
    return selectedQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options,
    }));
  }

  // Проверка ответов и сохранение результатов
  async submitExam(studentId: string, dto: SubmitExamDto) {
    const { courseId, answers } = dto;
    const QUESTIONS_COUNT = 20;
    const POINTS_PER_QUESTION = 5;
    const MAX_SCORE = 100;
    const PASSING_SCORE = 80; // Проходной балл, например 80/100

    if (answers.length !== QUESTIONS_COUNT) {
      throw new BadRequestException(`Необходимо ответить ровно на ${QUESTIONS_COUNT} вопросов`);
    }

    let score = 0;

    // Проверяем ответы
    for (const answer of answers) {
      const question = await this.prisma.question.findUnique({
        where: { id: answer.questionId },
      });

      // Если вопрос существует, относится к этому курсу и ответ верен
      if (
        question && 
        question.courseId === courseId && 
        question.correctOptionIndex === answer.selectedOptionIndex
      ) {
        score += POINTS_PER_QUESTION;
      }
    }

    const passed = score >= PASSING_SCORE;

    // Сохраняем результат
    const examResult = await this.prisma.exam.create({
      data: {
        studentId,
        courseId,
        score,
        maxScore: MAX_SCORE,
        passed,
      },
    });

    // Если экзамен сдан, генерируем сертификат
    if (passed) {
      await this.prisma.certificate.create({
        data: {
          studentId,
          courseId,
          url: `https://api.rushddigital.tj/certificates/generate/${examResult.id}`, // Заглушка роута генерации PDF
        },
      });
    }

    return examResult;
  }

  // Доступ для Head of Sales к результатам конкретного ученика
  async getStudentExams(studentId: string) {
    return this.prisma.exam.findMany({
      where: { studentId },
      include: {
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}