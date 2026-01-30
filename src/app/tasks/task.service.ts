import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tasks'; //Proxy

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }
  updateTaskStatus(id: number, newStatus: string): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/status/${id}`, { status: newStatus });
  }
  updateTaskDescription(id: number, newDesc: string): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/description/${id}`, { description: newDesc });
  }
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  addTask(task: { title: string; description: string; status: string }): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }
}