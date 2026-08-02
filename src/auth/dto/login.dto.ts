import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Минимальная длина пароля — 6 символов' })
  password: string;
}