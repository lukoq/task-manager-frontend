import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TaskService } from './task.service';
import { Task } from './task.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  
  tasks = signal<Task[]>([]);
  expandedTaskId = signal<number|null>(null);
  isEditModalOpen = signal(false);
  isRemoveModalOpen = signal(false);
  taskToEdit = signal<Task|null>(null);

  readonly statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];

  openEditModal(task: Task) {
    this.taskToEdit.set({ ...task }); //copy
    this.isEditModalOpen.set(true);
  }

  openRemoveModal(task: Task) {
    this.taskToEdit.set({ ...task }); //copy
    this.isRemoveModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.taskToEdit.set(null);
  }

  closeRemoveModal() {
    this.isRemoveModalOpen.set(false);
    this.taskToEdit.set(null);
  }

  changeStatus(newStatus: string) {
    const task = this.taskToEdit();
    if (task) {
      this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
        next: (updatedTask) => {
          this.taskToEdit.set(updatedTask);
          if (updatedTask) {
            this.tasks.update(list => list.map(t => t.id === updatedTask.id ? updatedTask : t));
          }
          console.log(updatedTask.status);
        },
        error: (err) => {
          console.error('Err:', err);
        }
      });
    }
  }

  confirmDelete() {
    const task = this.taskToEdit();
    if (task) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.tasks.update(list => list.filter(t => t.id !== task.id));
          this.closeRemoveModal();
        },
        error: (err) => console.error(err)
      });
    }
  }

  toggleTask(id: number) {
    this.expandedTaskId.update(currentId => currentId === id ? null : id);
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data); 
      },
      error: (err) => console.error('err', err)
    });
  }

  
}