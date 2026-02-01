import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-manager-frontend');
  isDarkModeActive = signal(false);

  toggleTheme(): void {
    this.isDarkModeActive() ? this.isDarkModeActive.set(false) : this.isDarkModeActive.set(true);
    document.body.classList.toggle('dark-theme');
  }
}
