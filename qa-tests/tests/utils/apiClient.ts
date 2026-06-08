import { APIRequestContext, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3000';

export class ApiClient {
  constructor(private readonly req: APIRequestContext) {}

  async list(): Promise<any[]> {
    const res = await this.req.get(`${BASE}/todos/list`);
    expect(res.ok()).toBeTruthy();
    return res.json();
  }

  async create(text: string, dueDate?: string | null) {
    const body: any = { text };
    if (dueDate !== undefined) body.dueDate = dueDate;
    return this.req.post(`${BASE}/todos/create`, { data: body });
  }

  async edit(id: string, data: { text?: string; dueDate?: string }) {
    return this.req.put(`${BASE}/todos/edit/${id}`, { data });
  }

  async setDone(id: string, done: boolean) {
    return this.req.patch(`${BASE}/todos/done/${id}`, { data: { done } });
  }

  async delete(id: string) {
    return this.req.delete(`${BASE}/todos/delete/${id}`);
  }

  // Deletes all existing todos via the API
  async clearAll() {
    const todos: any[] = await this.list();
    for (const todo of todos) {
      await this.delete(todo.id);
    }
  }
}