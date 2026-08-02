import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional() @IsString() whatsapp?: string;
  @IsOptional() @IsString() telegram?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsString() sourceId?: string;
  @IsOptional() @IsString() managerId?: string;
}