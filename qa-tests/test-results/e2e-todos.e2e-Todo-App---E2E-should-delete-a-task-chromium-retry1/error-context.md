# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\todos.e2e.spec.ts >> Todo App - E2E >> should delete a task
- Location: tests\e2e\todos.e2e.spec.ts:81:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4200/
Call log:
  - navigating to "http://localhost:4200/", waiting until "load"

```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class TodoPage {
  4  |   readonly inputText: Locator;
  5  |   readonly inputDate: Locator;
  6  |   readonly addButton: Locator;
  7  |   readonly todoItems: Locator;
  8  |   readonly todoCounter: Locator;
  9  |   readonly emptyState: Locator;
  10 |   readonly limitHint: Locator;
  11 |   readonly loadingSpinner: Locator;
  12 | 
  13 |   constructor(readonly page: Page) {
  14 |     this.inputText      = page.locator('[data-test="new-task-text"]');
  15 |     this.inputDate      = page.locator('[data-test="new-task-date"]');
  16 |     this.addButton      = page.locator('[data-test="add-task-button"]');
  17 |     this.todoItems      = page.locator('[data-test="todo-item"]');
  18 |     this.todoCounter    = page.locator('[data-test="todo-counter"]');
  19 |     this.emptyState     = page.locator('[data-test="empty-state"]');
  20 |     this.limitHint      = page.locator('[data-test="limit-hint"]');
  21 |     this.loadingSpinner = page.locator('[data-test="loading-spinner"]');
  22 |   }
  23 | 
  24 |   
  25 |   async goto() {
> 26 |     await this.page.goto('/');
     |                     ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4200/
  27 |   }
  28 | 
  29 |   
  30 |   async addTodo(text: string, date?: string) {
  31 |     await this.inputText.fill(text);
  32 |     if (date) await this.inputDate.fill(date);
  33 |     await this.addButton.click();
  34 |   }
  35 | 
  36 |   
  37 |   getTodoByText(text: string): Locator {
  38 |     return this.page.locator(`[data-test="todo-item"]:has-text("${text}")`);
  39 |   }
  40 | 
  41 |   
  42 |   async markDone(text: string) {
  43 |     const item = this.getTodoByText(text);
  44 |     await item.locator('[data-test="todo-done-checkbox"]').check();
  45 |   }
  46 | 
  47 |   
  48 |   async unmarkDone(text: string) {
  49 |     const item = this.getTodoByText(text);
  50 |     await item.locator('[data-test="todo-done-checkbox"]').uncheck();
  51 |   }
  52 | 
  53 |   
  54 |   async editTodo(currentText: string, newText: string) {
  55 |     const item = this.getTodoByText(currentText);
  56 |     await item.locator('[data-test="edit-button"]').click();
  57 |     const editInput = item.locator('[data-test="edit-text-input"]');
  58 |     await editInput.clear();
  59 |     await editInput.fill(newText);
  60 |     await item.locator('[data-test="save-edit-button"]').click();
  61 |   }
  62 | 
  63 |   
  64 |   async deleteTodo(text: string) {
  65 |     const item = this.getTodoByText(text);
  66 |     await item.locator('[data-test="delete-button"]').click();
  67 |   }
  68 | 
  69 |   
  70 |   async sortBy(field: 'text' | 'dueDate') {
  71 |     await this.page.locator(`[data-test="sort-${field}"]`).click();
  72 |   }
  73 | 
  74 |   
  75 |   async getTodoCount(): Promise<number> {
  76 |     return this.todoItems.count();
  77 |   }
  78 | 
  79 |   
  80 |   async expectTodoVisible(text: string) {
  81 |     await expect(this.getTodoByText(text)).toBeVisible();
  82 |   }
  83 | 
  84 |   
  85 |   async expectTodoNotVisible(text: string) {
  86 |     await expect(this.getTodoByText(text)).toHaveCount(0);
  87 |   }
  88 | }
```