import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
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
  sortField = signal<keyof Task | null>('id');
  sortDir = signal<'asc' | 'desc'>('asc');
  page = signal(1);
  pageSize = signal(20);
  searchTerm = signal('');
  showFilters = signal(false);
  selectedStatus = signal<string | null>(null);


  readonly statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];
  readonly resetPageEffect = effect(() => {
    this.selectedStatus();
    this.searchTerm();
    this.page.set(1);
  });
  wasOpened = false;

  taskForm = new FormGroup({
    title: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(3)] 
    }),
    description: new FormControl('', { 
      nonNullable: true 
    }),
    status: new FormControl('TODO', { nonNullable: true }),
    dueDate: new FormControl({ value: null, disabled: true })
  });

  newDescriptionForm = new FormGroup({
    description: new FormControl('', { 
      nonNullable: true 
    })
  });

  openEditModal(task: Task) {
    this.taskToEdit.set({ ...task }); //copy
    this.isEditModalOpen.set(true);
    this.newDescriptionForm.patchValue({
      description: task.description
    });
    this.newDescriptionForm.get('description')?.disable();
  }

  openRemoveModal(task: Task) {
    this.taskToEdit.set({ ...task }); //copy
    this.isRemoveModalOpen.set(true);
  }

  openAddModal() {
    this.isAddModalOpen.set(true);
    this.taskForm.get('dueDate')?.disable();
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.taskToEdit.set(null);
    this.newDescriptionForm.reset(); 
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

  nextPage() {
    if(this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
    }
  }

  prevPage() {
    if(this.page() > 1) {
      this.page.update(p => p - 1);
    }
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
    this.wasOpened = true; 
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onStatusFilter(status: string): void {
    this.selectedStatus.set(
      this.selectedStatus() === status ? null : status
    );
  }

  toggleDescriptionEdit(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const descControl = this.newDescriptionForm.get('description');
    isChecked ? descControl?.enable() : descControl?.disable();
  }
  toggleAddDueDate(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const dateControl = this.taskForm.get('dueDate');
  
    if (isChecked) {
      dateControl?.enable();
      if (!dateControl?.value) {
        const today = new Date().toISOString().split('T')[0];
        dateControl?.setValue(today as any);
      }
    } else {
      dateControl?.setValue(null);
      dateControl?.disable();
    }
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
  changeDescription() {
    const task = this.taskToEdit();
    const newDescription = this.newDescriptionForm.get('description')?.value;
      if (task && newDescription !== undefined && newDescription !== task.description) {
        this.taskService.updateTaskDescription(task.id, newDescription).subscribe({
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

        this.closeEditModal();
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
        console.log(data)
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
            status: 'TODO',
            dueDate: null,
          });
          this.closeAddModal(); 
        },
        error: (err) => {
          console.error('Err:', err);
        }
      });
    }
  }
  toggleSort(field: keyof Task): void {
    this.page.set(1);
    if(this.sortField() === field) {
      this.sortDir.set(
        this.sortDir() === 'asc' ? 'desc' : 'asc'
      );
    } 
    else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
  }

  calculateDeadline(dueDate: string): string {
    if (!dueDate) {
      return ''; 
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const deadline = new Date(dueDate);
    deadline.setHours(0, 0, 0, 0);
  
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) 
      return 'Today';
    if (diffDays === 1) 
      return 'Tomorrow';
    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else {
      return 'After the deadline';
    }
  }

  /* Computed */

  sortedTasks = computed(() => {
    const field = this.sortField();
    const direction = this.sortDir();
    const tasks = this.filteredTasks();
    if(!field) {
      return tasks;
    }
    else {
      return [...tasks].sort((a, b) => {
        const valueA = a[field];
        const valueB = b[field];
        if (valueA == null || valueB == null) {
          return 0;
        }
        if (valueA < valueB) {
          return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  });

  pagedTasks = computed(() => {
    const page = this.page();
    const size = this.pageSize();
    const tasks = this.sortedTasks();
  
    const start = (page-1) * size;
    const end = start + size;
  
    return tasks.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.sortedTasks().length / this.pageSize());
  });

  filteredTasks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const tasks = this.tasks();
    const status = this.selectedStatus();
  
    return tasks.filter(task => {
      const matchesSearch = !term || task.title.toLowerCase().includes(term); 
      const matchesStatus = !status || task.status === status;
  
      return matchesSearch && matchesStatus;
    });
  });


}
