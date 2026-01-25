import { Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { TaskService } from './task.service';
import { Task } from './task.model';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  private taskService = inject(TaskService);
  
  tasks = signal<Task[]>([]);
  expandedTaskId = signal<number|null>(null);
  taskToEdit = signal<Task|null>(null);
  isEditModalOpen = signal(false);
  isRemoveModalOpen = signal(false);
  isAddModalOpen = signal(false);

  readonly statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];

  taskForm = new FormGroup({
    title: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(3)] 
    }),
    description: new FormControl('', { 
      nonNullable: true 
    }),
    status: new FormControl('TODO', { nonNullable: true })
  });

  openEditModal(task: Task) {
    this.taskToEdit.set({ ...task }); //copy
    this.isEditModalOpen.set(true);
  }

  openRemoveModal(task: Task) {
    this.taskToEdit.set({ ...task }); //copy
    this.isRemoveModalOpen.set(true);
  }

  openAddModal() {
    this.isAddModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.taskToEdit.set(null);
  }

  closeRemoveModal() {
    this.isRemoveModalOpen.set(false);
    this.taskToEdit.set(null);
  }

  closeAddModal() {
    this.isAddModalOpen.set(false);
  }

  toggleTask(id: number) {
    this.expandedTaskId.update(currentId => currentId === id ? null : id);
  }

  ngOnInit(): void {
    this.loadTasks();
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

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data); 
      },
      error: (err) => console.error('err', err)
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask = this.taskForm.getRawValue();
      this.taskService.addTask(newTask).subscribe({
        next: (response) => {
          this.tasks.update(list => [...list, response]);
          this.taskForm.reset({ 
            title: '', 
            description: '', 
            status: 'TODO' 
          });
          this.closeAddModal(); 
        },
        error: (err) => {
          console.error('Err:', err);
        }
      });
    }
  }

}