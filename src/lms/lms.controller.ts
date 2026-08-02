import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lms')
export class LmsController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly examsService: ExamsService,
  ) {}

  // ================= ADMIN: Управление контентом =================
  
  @Roles(Role.ADMIN)
  @Post('courses')
  createCourse(@Body() data: { title: string; description?: string }) {
    return this.coursesService.createCourse(data.title, data.description);
  }

  @Roles(Role.ADMIN)
  @Post('courses/:id/questions')
  addQuestion(
    @Param('id') courseId: string,
    @Body() data: { text: string; options: string[]; correctOptionIndex: number }
  ) {
    return this.coursesService.addQuestionToCourse(courseId, data.text, data.options, data.correctOptionIndex);
  }

  // ================= STUDENT: Прохождение экзамена =================
  
  @Roles(Role.STUDENT)
  @Get('exams/generate/:courseId')
  generateExam(@Param('courseId') courseId: string) {
    return this.examsService.generateExam(courseId);
  }

  @Roles(Role.STUDENT)
  @Post('exams/submit')
  submitExam(@Req() req: Request, @Body() dto: SubmitExamDto) {
    const studentId = req.user['sub'];
    return this.examsService.submitExam(studentId, dto);
  }

  // ================= HEAD OF SALES / ADMIN: Просмотр результатов =================

  @Roles(Role.HEAD_SALES, Role.ADMIN)
  @Get('students/:id/results')
  getStudentResults(@Param('id') studentId: string) {
    return this.examsService.getStudentExams(studentId);
  }
}