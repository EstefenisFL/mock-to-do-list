import { test, expect, request } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';
import { TodoPage } from '../utils/todoPage';

test.describe('Todo App - E2E', () => {
  let api: ApiClient;

  test.beforeAll(async () => {
    const ctx = await request.newContext();
    api = new ApiClient(ctx);
  });

  test.beforeEach(async ({ page }) => {
    // Clean state before each test
    await api.clearAll();
  });

  // -------------------------------------------------------
  // ADD
  // -------------------------------------------------------
  test('should add a simple task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Buy coffee');

    await todoPage.expectTodoVisible('Buy coffee');
    expect(await todoPage.getTodoCount()).toBe(1);
  });

  test('should add a task with due date', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Pay bills', '2026-12-31');

    const item = todoPage.getTodoByText('Pay bills');
    await expect(item).toBeVisible();
    await expect(item.locator('[data-test="todo-due-date"]')).toContainText('Due 12/31/26');
  });

  test('should not add a task when text is empty', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addButton.click();

    expect(await todoPage.getTodoCount()).toBe(0);
  });

  // -------------------------------------------------------
  // LIMIT
  // -------------------------------------------------------
  test('should show counter and disable Add button at 10 tasks', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    for (let i = 1; i <= 10; i++) {
      await todoPage.addTodo(`Task ${i}`);
      await expect(todoPage.todoCounter).toHaveText(`(${i}/10)`);
    }

    await expect(todoPage.todoCounter).toHaveText('(10/10)');
    await expect(todoPage.addButton).toBeDisabled();
    await expect(todoPage.limitHint).toBeVisible();
  });

  // -------------------------------------------------------
  // DONE
  // -------------------------------------------------------
  test('should mark a task as done', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Learn Playwright');
    await todoPage.markDone('Learn Playwright');

    const item = todoPage.getTodoByText('Learn Playwright');
    await expect(item.locator('input[type="checkbox"]')).toBeChecked();
  });

  // -------------------------------------------------------
  // EDIT
  // -------------------------------------------------------
  test('should edit a task text', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Old text');
    await todoPage.editTodo('Old text', 'New text');

    await todoPage.expectTodoVisible('New text');
    await todoPage.expectTodoNotVisible('Old text');
  });

  // -------------------------------------------------------
  // DELETE
  // -------------------------------------------------------
  test('should delete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task to delete');
    await todoPage.deleteTodo('Task to delete');
    const todoPageUpdated = new TodoPage(page);
    await todoPageUpdated.goto();

    expect(await todoPageUpdated.getTodoCount()).toBe(0);
  });

  // -------------------------------------------------------
  // PERSIST
  // -------------------------------------------------------
  test('should persist tasks after page reload', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Persistent task');
    await page.reload();

    await todoPage.expectTodoVisible('Persistent task');
  });

  // -------------------------------------------------------
  // SORT
  // -------------------------------------------------------
  test('should sort tasks by text (A–Z)', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Zebra');
    await todoPage.addTodo('Ant');

    await expect(
    page.locator('[data-test="todo-item"]').nth(1)
  ).toBeVisible();

    await todoPage.sortBy('text');

    const items = page.locator('[data-test="todo-item"] [data-test="todo-text"]');
    await expect(items.nth(0)).toHaveText('Ant');
    await expect(items.nth(1)).toHaveText('Zebra');
  });

  test('should sort tasks by due date (ascending)', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await todoPage.addTodo('Task C', '2026-12-31');
    await todoPage.addTodo('Task A', '2026-01-01');

    await expect(
    page.locator('[data-test="todo-item"]').nth(1)
  ).toBeVisible();

    await todoPage.sortBy('due-date');

    const items = page.locator('[data-test="todo-item"] [data-test="todo-text"]');
    await expect(items.nth(0)).toHaveText('Task A');
    await expect(items.nth(1)).toHaveText('Task C');
  });

  // -------------------------------------------------------
  // EMPTY STATE
  // -------------------------------------------------------
  test('should show initial empty state', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();

    await expect(todoPage.emptyState).toBeVisible();
    expect(await todoPage.getTodoCount()).toBe(0);
  });
});