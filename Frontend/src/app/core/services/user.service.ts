import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../../environment/environment';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.baseUrl}register/`; 

  constructor(private http: HttpClient) { }
  
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${environment.baseUrl}login/`, credentials).pipe(
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  } 
  
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, user).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  } 
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}/`).pipe(
      catchError(error => {
        console.error('Get user error:', error);
        return throwError(() => error);
      })
    );
  }
  
}
