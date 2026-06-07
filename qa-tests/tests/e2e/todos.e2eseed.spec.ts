/* import { test, expect, request } from '@playwright/test';
import { ApiClientSeedjson } from '../utils/apiClientSeedjson';
import { TodoPage } from '../utils/todoPage';
import fs from 'fs';
import path from 'path';

const seedData = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../fixtures/todo-seed.json'),
    'utf-8'
  )
) as { text: string; dueDate?: string | null }[];

function formatUiDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const shortYear = year % 100;
  return `${month}/${day}/${shortYear.toString().padStart(2, '0')}`;
}

test.describe('Todo App - Seeded E2E Scenarios', () => {
  let api: ApiClientSeedjson;

  test.beforeAll(async () => {
    const ctx = await request.newContext();
    api = new ApiClientSeedjson(ctx);
  });

  test.beforeEach(async ({ page }) => {
    await api.seedFromFile('fixtures/todo-seed.json');
    const todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should display all seeded tasks in the UI', async ({ page }) => {
    const todoPage = new TodoPage(page);

    for (const item of seedData) {
      await todoPage.expectTodoVisible(item.text);
    }

    expect(await todoPage.getTodoCount()).toBe(seedData.length);
  });

  test('should show correct due dates from seed', async ({ page }) => {
    const todoPage = new TodoPage(page);

    for (const item of seedData) {
      const todo = todoPage.getTodoByText(item.text);
      const dueDateEl = todo.locator('[data-test="todo-due-date"]');

      if (item.dueDate) {
        await expect(dueDateEl).toContainText(formatUiDate(item.dueDate));
      } else {
        await expect(dueDateEl).toContainText('No due date');
      }
    }
  });

  test('should sort seeded tasks by text A–Z', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.sortBy('text');

    const items = page.locator('[data-test="todo-item"] [data-test="todo-text"]');
    const texts = await items.allTextContents();

    const sorted = [...texts].sort((a, b) => a.localeCompare(b));
    expect(texts).toEqual(sorted);
  });

  test('should sort seeded tasks by due date ascending', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.sortBy('due-date');

    const items = page.locator('[data-test="todo-item"] [data-test="todo-text"]');
    const texts = await items.allTextContents();

    expect(texts[0]).toBe('Read a chapter of a book');
    expect(texts[1]).toBe('Call mom');
    expect(texts[2]).toBe('Clean the kitchen');
    expect(texts[3]).toBe('Buy groceries at the supermarket');
    expect(texts[4]).toBe('Walk the dog in the evening');
    expect(texts[5]).toBe('Pay electricity bill');

    const lastTwo = [texts[6], texts[7]];
    expect(lastTwo).toContain('Finish mock Todo tests documentation');
    expect(lastTwo).toContain('Schedule dentist appointment');
  });

  test('should delete a seeded task and update count', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const taskToDelete = 'Buy groceries at the supermarket';

    await todoPage.deleteTodo(taskToDelete);

    await todoPage.expectTodoNotVisible(taskToDelete);
    expect(await todoPage.getTodoCount()).toBe(seedData.length - 1);
  });

  test('should edit a seeded task text', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const original = 'Buy groceries at the supermarket';
    const updated = 'Buy groceries at the market';

    await todoPage.editTodo(original, updated);

    await todoPage.expectTodoVisible(updated);
    await todoPage.expectTodoNotVisible(original);
    expect(await todoPage.getTodoCount()).toBe(seedData.length);
  });

  test('should mark a seeded task as done', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const taskText = 'Call mom';

    await todoPage.markDone(taskText);

    const item = todoPage.getTodoByText(taskText);
    await expect(item.locator('input[type="checkbox"]')).toBeChecked();
  });

  test('should uncheck a seeded task after marking as done', async ({ page }) => {
    const todoPage = new TodoPage(page);
    const taskText = 'Call mom';

    await todoPage.markDone(taskText);
    const item = todoPage.getTodoByText(taskText);
    const checkbox = item.locator('input[type="checkbox"]');

    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should add a new task on top of seeded data', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Brand new task');

    await todoPage.expectTodoVisible('Brand new task');
    expect(await todoPage.getTodoCount()).toBe(seedData.length + 1);
  });

  test('should persist seeded tasks after page reload', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await page.reload();

    for (const item of seedData) {
      await todoPage.expectTodoVisible(item.text);
    }

    expect(await todoPage.getTodoCount()).toBe(seedData.length);
  });
}); */