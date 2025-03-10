import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.baseUrl}login/`;
  private refreshUrl = `${environment.baseUrl}refresh-token/`; 
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('user_name', response.user?.first_name || response.user?.email);
          this.isAuthenticatedSubject.next(true);
          this.userNameSubject.next(response.user?.first_name || response.user?.email);
        }
      }),
      catchError(error => {
        console.error('Auth error:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next(null);
    this.router.navigate(['/login']);  
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserName(): string | null {
    return localStorage.getItem('user_name');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private checkToken(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
  
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http.post<any>(this.refreshUrl, { refresh_token: refreshToken }).pipe(
      map((response) => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
          return response.access;
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        this.logout(); 
        return throwError(() => error);
      })
    );
  }
}
