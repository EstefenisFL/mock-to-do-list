import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
  readonly inputText: Locator;
  readonly inputDate: Locator;
  readonly addButton: Locator;
  readonly todoItems: Locator;
  readonly todoCounter: Locator;
  readonly emptyState: Locator;
  readonly limitHint: Locator;

  constructor(readonly page: Page) {
    this.inputText      = page.locator('[data-test="new-task-text"]');
    this.inputDate      = page.locator('[data-test="new-task-date"]');
    this.addButton      = page.locator('[data-test="add-task-button"]');
    this.todoItems      = page.locator('[data-test="todo-list"] [data-test="todo-item"]');
    this.todoCounter    = page.locator('[data-test="task-count"]');
    this.emptyState     = page.locator('[data-test="empty-state"]');
    this.limitHint      = page.locator('[data-test="limit-hint"]');
  }

  
  async goto() {
    await this.page.goto('/');
  }

  
  async addTodo(text: string, date?: string) {
    await this.inputText.fill(text);
    if (date) await this.inputDate.fill(date);
    await this.addButton.click();
  }

  
  getTodoByText(text: string): Locator {
    return this.page.locator(`[data-test="todo-item"]:has-text("${text}")`);
  }

  
async markDone(text: string) {
  const item = this.getTodoByText(text);
  const checkbox = item.locator('input[type="checkbox"]');
  await checkbox.check();
}

  
  async unmarkDone(text: string) {
    const item = this.getTodoByText(text);
    await item.locator('[data-test="todo-done-checkbox"]').uncheck();
  }

  
  async editTodo(currentText: string, newText: string) {
    const item = this.getTodoByText(currentText);
    await item.locator('[data-test="edit-button"]').click();
    const editInput = this.page.locator('[data-test="edit-task-text"]');
    await editInput.clear();
    await editInput.fill(newText);
    await this.page.locator('[data-test="save-edit-button"]').click();
  }

  
  async deleteTodo(text: string) {
    const item = this.getTodoByText(text);
    await item.locator('[data-test="delete-button"]').click();
  }

  
  async sortBy(field: 'text' | 'due-date') {
    const sortButton = this.page.locator(`[data-test="sort-by-${field}"]`);
    await sortButton.waitFor({ state: 'visible', timeout: 10000 });
    await sortButton.click();
  }

  
  async getTodoCount(): Promise<number> {
    return this.todoItems.count();
  }

  
  async expectTodoVisible(text: string) {
    await expect(this.getTodoByText(text)).toBeVisible();
  }

  
  async expectTodoNotVisible(text: string) {
    await expect(this.getTodoByText(text)).toHaveCount(0);
  }
}