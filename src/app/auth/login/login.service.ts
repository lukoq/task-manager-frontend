import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse } from './login.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:8080/api/auth/login'; //Proxy


  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  public isLoggedIn = this.isAuthenticated.asObservable();

  private hasToken(): boolean {
    if(isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }


  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, request).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.isAuthenticated.next(true);
      })
    )
  }
  
  logout() {
    if(isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

}