import { Routes } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component'; 
import { LoginComponent } from './auth/login/login.component'; 
import { RegisterComponent } from './auth/register/register.component'; 
import { StatsComponent } from './stats/stats.component'; 
import { authGuard } from './auth/token/auth-guard';
import { loginGuard } from './auth/login/login-guard';

export const routes: Routes = [
    { 
        path: 'tasks', 
        component: TasksComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'statistics', 
        component: StatsComponent,
        canActivate: [authGuard]
    },
    { path: 'login', component: LoginComponent, canActivate: [loginGuard]},
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
] 
