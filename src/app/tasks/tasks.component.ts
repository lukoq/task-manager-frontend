import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TaskService } from './task.service';
import { Task } from './task.model';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  //styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  
  // Tworzymy sygnał na listę zadań
  tasks = signal<Task[]>([]);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data); 
      },
      error: (err) => console.error('Błąd pobierania:', err)
    });
  }
}