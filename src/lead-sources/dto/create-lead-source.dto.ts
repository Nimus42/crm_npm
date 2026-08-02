import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLeadSourceDto {
  @IsString()
  @IsNotEmpty({ message: 'Название источника не может быть пустым' })
  name: string;
}