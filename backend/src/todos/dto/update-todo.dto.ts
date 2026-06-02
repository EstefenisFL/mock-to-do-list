import { IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;
}
