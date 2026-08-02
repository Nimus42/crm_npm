import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  description: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsString()
  clientId?: string;
}