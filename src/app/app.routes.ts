import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component'; 
import { LoginComponent } from './auth/login/login.component'; 
import { RegisterComponent } from './auth/register/register.component'; 

export const routes: Routes = [
    { path: 'tasks', component: TasksComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
] 
