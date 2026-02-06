import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { tap } from 'rxjs/operators';
import { LoginRequest, AuthResponse } from './login.model';



@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth/login'; //Proxy


  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}`, request).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
      })
    );
  }




}