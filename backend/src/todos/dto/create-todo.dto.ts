import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsOptional()
  @IsString()
  dueDate?: string;
}
