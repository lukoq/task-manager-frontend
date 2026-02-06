import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component'; 
import { LoginComponent } from './auth/login/login.component'; 
import { RegisterComponent } from './auth/register/register.component'; 
import { authGuard } from './auth/token/auth-guard';

export const routes: Routes = [
    { 
        path: 'tasks', 
        component: TasksComponent,
        canActivate: [authGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
] 
