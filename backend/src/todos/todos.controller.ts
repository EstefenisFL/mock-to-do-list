import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  // Route 1: list items
  @Get('list')
  list(): Promise<Todo[]> {
    return this.todos.list();
  }

  // Route 2: create item
  @Post('create')
  create(@Body() dto: CreateTodoDto): Promise<Todo> {
    return this.todos.create(dto);
  }

  // Route 3: delete item
  @Delete('delete/:id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.todos.remove(id);
  }

  // Route 4: edit item
  @Put('edit/:id')
  edit(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todos.update(id, dto);
  }

  // Route 5: mark item as done (also supports unmark)
  @Patch('done/:id')
  markDone(
    @Param('id') id: string,
    @Body() body: { done?: boolean },
  ): Promise<Todo> {
    const done = body?.done ?? true;
    return this.todos.toggleDone(id, done);
  }
}
