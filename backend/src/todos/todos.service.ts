import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

export const MAX_TODOS = 10;

@Injectable()
export class TodosService implements OnModuleInit {
  private readonly filePath = join(process.cwd(), 'todos.json');
  private writeQueue: Promise<void> = Promise.resolve();

  async onModuleInit() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, '[]', 'utf8');
    }
  }

  async list(): Promise<Todo[]> {
    return this.readAll();
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    const todos = await this.readAll();
    if (todos.length > MAX_TODOS) {
      throw new BadRequestException(
        `Limit of ${MAX_TODOS} tasks reached. Delete one to add another.`,
      );
    }
    const todo: Todo = {
      id: randomUUID(),
      text: dto.text,
      dueDate: dto.dueDate ?? null,
      done: false,
      createdAt: new Date().toISOString(),
    };
    todos.push(todo);
    await this.writeAll(todos);
    return todo;
  }

  async update(id: string, dto: UpdateTodoDto): Promise<Todo> {
    const todos = await this.readAll();
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    if (dto.text !== undefined) todo.text = dto.text;
    if (dto.dueDate !== undefined) todo.dueDate = dto.dueDate;
    await this.writeAll(todos);
    return todo;
  }

  async toggleDone(id: string, done: boolean): Promise<Todo> {
    const todos = await this.readAll();
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    todo.done = done;
    await this.writeAll(todos);
    return todo;
  }

  async remove(id: string): Promise<void> {
    const todos = await this.readAll();
    const next = todos.filter((t) => t.id !== id);
    if (next.length === todos.length) {
      throw new NotFoundException(`Todo ${id} not found`);
    }
    await this.writeAll(next);
  }

  private async readAll(): Promise<Todo[]> {
    const raw = await fs.readFile(this.filePath, 'utf8');
    if (!raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Todo[]) : [];
    } catch {
      return [];
    }
  }

  private writeAll(todos: Todo[]): Promise<void> {
    const next = this.writeQueue.then(() =>
      fs.writeFile(this.filePath, JSON.stringify(todos, null, 2), 'utf8'),
    );
    this.writeQueue = next.catch(() => undefined);
    return next;
  }
}
