import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Recipe } from '../interfaces/recipe';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.baseUrl}recipes`;

  constructor(private http: HttpClient) {}

  getUserRecipes(): Observable<Recipe[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Unauthorized: Missing token'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Recipe[]>(`${this.apiUrl}/`, { headers });
  }  
  
  addRecipe(recipeData: Recipe): Observable<Recipe> {
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      console.error('Error: No token found in localStorage.');
      return throwError(() => new Error('Unauthorized: Missing token'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Recipe>(`${this.apiUrl}/create/`, recipeData, { headers });
  }

  deleteRecipe(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${recipeId}/`);
  }

  editRecipe(id: number, recipe: Recipe): Observable<Recipe> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Recipe>(`${this.apiUrl}/update/${id}/`, recipe, { headers });
  } 
  
}
