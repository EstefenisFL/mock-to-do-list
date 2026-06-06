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
    // Ensure a clean state before each test
    await api.clearAll();

    const todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should add a simple task', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Buy coffee');

    await todoPage.expectTodoVisible('Buy coffee');
    await expect(await todoPage.getTodoCount()).toBe(1);
  });

  test('should add a task with due date', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Pay bills', '2026-12-31');

    const item = todoPage.getTodoByText('Pay bills');
    await expect(item).toBeVisible();
    await expect(item.locator('[data-test="todo-due-date"]')).toContainText('2026-12-31');
  });

  test('should not add a task when text is empty', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Try to click Add with empty text
    await todoPage.addButton.click();

    await expect(await todoPage.getTodoCount()).toBe(0);
  });

  test('should show counter and disable Add button at 10 tasks (UI)', async ({ page }) => {
    const todoPage = new TodoPage(page);

    for (let i = 1; i <= 10; i++) {
      await todoPage.addTodo(`Task ${i}`);
    }

    await expect(todoPage.todoCounter).toHaveText('10/10');
    await expect(todoPage.addButton).toBeDisabled();
    await expect(todoPage.limitHint).toBeVisible();
  });

  test('should mark a task as done', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Learn Playwright');
    await todoPage.markDone('Learn Playwright');

    const item = todoPage.getTodoByText('Learn Playwright');
    await expect(item.locator('[data-test="todo-done-checkbox"]')).toBeChecked();
  });

  test('should edit a task text', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Old text');
    await todoPage.editTodo('Old text', 'New text');

    await todoPage.expectTodoVisible('New text');
    await todoPage.expectTodoNotVisible('Old text');
  });

  test('should delete a task', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Task to delete');
    await todoPage.deleteTodo('Task to delete');

    await expect(await todoPage.getTodoCount()).toBe(0);
  });

  test('should persist tasks after page reload', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Persistent task');
    await page.reload();

    await todoPage.expectTodoVisible('Persistent task');
  });

  test('should sort tasks by text (A–Z)', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Zebra');
    await todoPage.addTodo('Ant');
    await todoPage.addTodo('Monkey');

    await todoPage.sortBy('text');

    const items = page.locator('[data-test="todo-item"] [data-test="todo-text"]');
    await expect(items.nth(0)).toHaveText('Ant');
    await expect(items.nth(1)).toHaveText('Monkey');
    await expect(items.nth(2)).toHaveText('Zebra');
  });

  test('should sort tasks by due date (ascending)', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Task 1', '2026-12-31');
    await todoPage.addTodo('Task 2', '2026-01-01');
    await todoPage.addTodo('Task 3', '2026-06-15');

    await todoPage.sortBy('dueDate');

    const items = page.locator('[data-test="todo-item"] [data-test="todo-text"]');
    await expect(items.nth(0)).toHaveText('Task 2');
    await expect(items.nth(1)).toHaveText('Task 3');
    await expect(items.nth(2)).toHaveText('Task 1');
  });

  test('should show initial empty state', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await expect(todoPage.emptyState).toBeVisible();
    await expect(await todoPage.getTodoCount()).toBe(0);
  });

  test('should show and hide loading spinner', async ({ page }) => {
    const todoPage = new TodoPage(page);

    // Immediately after navigation, spinner should be visible (depends on implementation)
    await expect(todoPage.loadingSpinner).toBeVisible();

    // After some time, spinner should be hidden
    await expect(todoPage.loadingSpinner).not.toBeVisible({ timeout: 5000 });
  });
});