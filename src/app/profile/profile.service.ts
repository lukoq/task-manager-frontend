import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Profile } from './profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/users'; //Proxy

  getProfileInfo(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/me`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/change-password`, {oldPassword, newPassword}, {responseType: 'text' });
  }

  uploadProfilePicture(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<void>(`${this.apiUrl}/profile-picture`, formData);
  }
  
  getProfilePictureUrl(): string {
    return `${this.apiUrl}/profile-picture`;
  }
}