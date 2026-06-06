import { test, expect, request, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../utils/apiClient';

const BASE_URL = 'http://localhost:3000';

test.describe('API - Todo Endpoints', () => {
  let ctx: APIRequestContext;
  let api: ApiClient;

  test.beforeAll(async () => {
    ctx = await request.newContext({ baseURL: BASE_URL });
    api = new ApiClient(ctx);
  });

  test.afterAll(async () => {
    await ctx.dispose();
  });

  test.beforeEach(async () => {
    // Ensure a clean state before each test
    await api.clearAll();
  });

  // -------------------------------------------------------
  // LIST
  // -------------------------------------------------------
  test.describe('GET /todos/list', () => {

    test('should return 200 and an empty array when no todos exist', async () => {
      const res = await ctx.get('/todos/list');

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });

    test('should return 200 and all created todos', async () => {
      await api.create('Task A');
      await api.create('Task B');

      const res = await ctx.get('/todos/list');

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveLength(2);
    });

  });

  // -------------------------------------------------------
  // CREATE
  // -------------------------------------------------------
  test.describe('POST /todos/create', () => {

    test('should return 201 and the created todo with text and dueDate', async () => {
      const res = await api.create('Buy groceries', '2026-12-31');

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body).toMatchObject({
        text: 'Buy groceries',
        dueDate: '2026-12-31',
        done: false,
      });
      expect(body.id).toBeDefined();
      expect(body.createdAt).toBeDefined();
    });

    test('should return 201 and set dueDate to null when not provided', async () => {
      const res = await api.create('Read a book');

      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.text).toBe('Read a book');
      expect(body.dueDate).toBeNull();
      expect(body.done).toBe(false);
    });

    test('should return 400 when text field is missing', async () => {
      const res = await ctx.post('/todos/create', {
        data: { dueDate: '2026-12-31' },
      });

      expect(res.status()).toBe(400);
    });

    test('should return 400 when text field is empty string', async () => {
      const res = await ctx.post('/todos/create', {
        data: { text: '' },
      });

      expect(res.status()).toBe(400);
    });

    /**
     * BUG-001: The backend uses `todos.length > MAX_TODOS` instead of
     * `todos.length >= MAX_TODOS` (todos.service.ts).
     * MAX_TODOS = 10, so the API currently accepts 11 items before rejecting.
     * Expected behavior: reject the 11th item (status 400).
     * Actual behavior: accepts the 11th item and only rejects the 12th.
     *
     * The test below documents the CURRENT (buggy) behavior intentionally.
     * When the bug is fixed, change the assertions to reflect 10 as the limit.
     */
    test('BUG-001: API accepts 11 todos instead of 10 before enforcing the limit', async () => {
      // Create 11 todos — all should succeed (bug: should fail on 11th)
      for (let i = 1; i <= 11; i++) {
        const res = await api.create(`Task ${i}`);
        expect(res.status()).toBe(201);
      }

      // Only the 12th todo should be rejected
      const res12 = await api.create('Task 12 - should fail');
      expect(res12.status()).toBe(400);
    });

  });

  // -------------------------------------------------------
  // EDIT
  // -------------------------------------------------------
  test.describe('PUT /todos/edit/:id', () => {

    test('should return 200 and update the text of an existing todo', async () => {
      const created = await (await api.create('Original text')).json();

      const res = await api.edit(created.id, { text: 'Updated text' });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.text).toBe('Updated text');
      expect(body.id).toBe(created.id);
    });

    test('should return 200 and update the dueDate of an existing todo', async () => {
      const created = await (await api.create('Task with date', '2026-01-01')).json();

      const res = await api.edit(created.id, { dueDate: '2026-12-31' });

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.dueDate).toBe('2026-12-31');
    });

    test('should return 404 when editing a non-existent todo', async () => {
      const res = await api.edit('non-existent-id', { text: 'Does not matter' });

      expect(res.status()).toBe(404);
    });

  });

  // -------------------------------------------------------
  // DONE / TOGGLE
  // -------------------------------------------------------
  test.describe('PATCH /todos/done/:id', () => {

    test('should return 200 and mark a todo as done', async () => {
      const created = await (await api.create('Task to complete')).json();

      const res = await api.setDone(created.id, true);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.done).toBe(true);
    });

    test('should return 200 and unmark a todo (done: false)', async () => {
      const created = await (await api.create('Task to uncomplete')).json();
      await api.setDone(created.id, true);

      const res = await api.setDone(created.id, false);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.done).toBe(false);
    });

    test('should return 404 when toggling a non-existent todo', async () => {
      const res = await api.setDone('non-existent-id', true);

      expect(res.status()).toBe(404);
    });

  });

  // -------------------------------------------------------
  // DELETE
  // -------------------------------------------------------
  test.describe('DELETE /todos/delete/:id', () => {

    test('should return 204 and remove the todo from the list', async () => {
      const created = await (await api.create('Task to delete')).json();

      const res = await api.delete(created.id);
      expect(res.status()).toBe(204);

      // Confirm it no longer appears in the list
      const todos = await api.list();
      const found = todos.find((t: any) => t.id === created.id);
      expect(found).toBeUndefined();
    });

    test('should return 404 when deleting a non-existent todo', async () => {
      const res = await api.delete('non-existent-id');

      expect(res.status()).toBe(404);
    });

  });

});