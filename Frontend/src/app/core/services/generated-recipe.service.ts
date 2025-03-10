import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneratedRecipe } from '../interfaces/generated-recipe';
import { environment } from '../../../environment/environment';
import { AuthService } from './auth.service';  
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneratedRecipeService {
  private apiUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
    });
  }

  getGeneratedRecipes(): Observable<GeneratedRecipe[]> {
    return this.http.get<GeneratedRecipe[]>(`${this.apiUrl}generated-recipes/`, {
      headers: this.getAuthHeaders(),
    });
  }

  mixItUp(ingredients: string[]): Observable<GeneratedRecipe> {
    return this.http.post<GeneratedRecipe>(`${this.apiUrl}mix-it-up/`, { ingredients }, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteRecipe(recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${recipeId}/`, {
      headers: this.getAuthHeaders(),
    });
  }
}
