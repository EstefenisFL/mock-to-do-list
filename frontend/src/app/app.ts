import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

interface EditState {
  text: string;
  dueDate: Date | null;
}

type SortField = 'text' | 'dueDate';
type SortDirection = 'asc' | 'desc';

const MAX_TODOS = 10;

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    DatePipe,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly api = inject(TodoService);
  private readonly snack = inject(MatSnackBar);

  constructor() {
    const intl = inject(MatDatepickerIntl);
    intl.calendarLabel = 'Calendar';
    intl.openCalendarLabel = 'Open calendar';
    intl.closeCalendarLabel = 'Close calendar';
    intl.prevMonthLabel = 'Previous month';
    intl.nextMonthLabel = 'Next month';
    intl.prevYearLabel = 'Previous year';
    intl.nextYearLabel = 'Next year';
    intl.prevMultiYearLabel = 'Previous 21 years';
    intl.nextMultiYearLabel = 'Next 21 years';
    intl.switchToMonthViewLabel = 'Switch to month view';
    intl.switchToMultiYearViewLabel = 'Choose month and year';
    intl.changes.next();
  }

  protected readonly todos = signal<Todo[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly editBuffer = signal<EditState>({ text: '', dueDate: null });

  protected readonly sortField = signal<SortField>('dueDate');
  protected readonly sortDirection = signal<SortDirection>('asc');

  protected readonly maxTodos = MAX_TODOS;
  protected readonly atLimit = computed(() => this.todos().length >= MAX_TODOS);

  protected readonly sortedTodos = computed<Todo[]>(() => {
    const items = [...this.todos()];
    const field = this.sortField();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      let cmp: number;
      if (field === 'text') {
        cmp = a.text.localeCompare(b.text, undefined, { sensitivity: 'base' });
      } else {
        cmp = (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
      }
      return cmp * dir;
    });
    return items;
  });

  protected newText = '';
  protected newDueDate: Date | null = null;

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (items) => {
        this.todos.set(items);
        this.loading.set(false);
      },
      error: (err) => this.handleError('Failed to load tasks', err),
    });
  }

  add(): void {
    if (this.atLimit()) {
      this.snack.open(
        `Limit of ${MAX_TODOS} tasks reached. Delete one to add another.`,
        'OK',
        { duration: 3000 },
      );
      return;
    }
    const text = this.newText.trim();
    if (!text) {
      this.snack.open('Text is required', 'OK', {
        duration: 2500,
      });
      return;
    }
    const due = this.newDueDate ? this.formatDate(this.newDueDate) : null;
    this.api.create(text, due).subscribe({
      next: (todo) => {
        this.todos.update((list) => [...list, todo]);
        this.newText = '';
        this.newDueDate = null;
      },
      error: (err) => this.handleError('Failed to create task', err),
    });
  }

  startEdit(todo: Todo): void {
    this.editingId.set(todo.id);
    this.editBuffer.set({
      text: todo.text,
      dueDate: todo.dueDate ? this.parseDate(todo.dueDate) : null,
    });
  }

  private parseDate(yyyymmdd: string): Date | null {
    const [y, m, d] = yyyymmdd.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  saveEdit(todo: Todo): void {
    const buf = this.editBuffer();
    const text = buf.text.trim();
    if (!text) {
      this.snack.open('Text is required', 'OK', {
        duration: 2500,
      });
      return;
    }
    const due = buf.dueDate ? this.formatDate(buf.dueDate) : null;
    this.api.edit(todo.id, text, due).subscribe({
      next: (updated) => {
        this.todos.update((list) =>
          list.map((t) => (t.id === updated.id ? updated : t)),
        );
        this.editingId.set(null);
      },
      error: (err) => this.handleError('Failed to edit task', err),
    });
  }

  toggleDone(todo: Todo, done: boolean): void {
    this.api.markDone(todo.id, done).subscribe({
      next: (updated) =>
        this.todos.update((list) =>
          list.map((t) => (t.id === updated.id ? updated : t)),
        ),
      error: (err) => this.handleError('Failed to update status', err),
    });
  }

  remove(todo: Todo): void {
    this.api.remove(todo.id).subscribe({
      next: () =>
        this.todos.update((list) => list.filter((t) => t.id !== todo.id)),
      error: (err) => this.handleError('Failed to delete task', err),
    });
  }

  protected setSortField(field: SortField): void {
    if (field) this.sortField.set(field);
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
  }

  protected updateEditText(value: string): void {
    this.editBuffer.update((state) => ({ ...state, text: value }));
  }

  protected updateEditDate(value: Date | null): void {
    this.editBuffer.update((state) => ({ ...state, dueDate: value }));
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private handleError(message: string, err: unknown): void {
    console.error(message, err);
    this.loading.set(false);
    const backendMsg = this.extractBackendMessage(err);
    this.snack.open(backendMsg ?? message, 'OK', { duration: 3000 });
  }

  private extractBackendMessage(err: unknown): string | null {
    const body = (err as { error?: { message?: string | string[] } } | null)?.error;
    if (!body) return null;
    if (typeof body.message === 'string') return body.message;
    if (Array.isArray(body.message) && body.message.length > 0) {
      return String(body.message[0]);
    }
    return null;
  }
}
