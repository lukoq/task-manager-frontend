import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Profile } from './profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tasks'; //Proxy

  getProfileInfo(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profile`);
  }
}