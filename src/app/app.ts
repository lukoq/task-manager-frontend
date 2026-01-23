import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component'; // 1. Zaimportuj klasę

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    TasksComponent // 2. Dodaj tutaj! Bez tego <app-tasks> to dla Angulara zwykły, nic nie znaczący tekst.
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-manager-frontend');
}
