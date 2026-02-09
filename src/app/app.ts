import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './auth/login/login.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public loginService = inject(LoginService);
  protected readonly title = signal('task-manager-frontend');
  isDarkModeActive = signal(false);

  toggleTheme(): void {
    this.isDarkModeActive() ? this.isDarkModeActive.set(false) : this.isDarkModeActive.set(true);
    document.body.classList.toggle('dark-theme');
  }
  onLogout() : void {
    this.loginService.logout();
  }
}
