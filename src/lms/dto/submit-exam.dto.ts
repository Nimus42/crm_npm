import { IsArray, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsString()
  questionId: string;

  @IsNumber()
  selectedOptionIndex: number;
}

export class SubmitExamDto {
  @IsString()
  courseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}