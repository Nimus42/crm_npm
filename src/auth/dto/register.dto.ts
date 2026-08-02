import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role, Language } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Минимальная длина пароля — 6 символов' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}