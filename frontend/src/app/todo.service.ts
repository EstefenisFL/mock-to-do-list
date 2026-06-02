import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:3000/todos';

  list(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.base}/list`);
  }

  create(text: string, dueDate: string | null): Observable<Todo> {
    return this.http.post<Todo>(`${this.base}/create`, { text, dueDate });
  }

  edit(id: string, text: string, dueDate: string | null): Observable<Todo> {
    return this.http.put<Todo>(`${this.base}/edit/${id}`, { text, dueDate });
  }

  markDone(id: string, done: boolean): Observable<Todo> {
    return this.http.patch<Todo>(`${this.base}/done/${id}`, { done });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/delete/${id}`);
  }
}
