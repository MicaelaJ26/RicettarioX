import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Recipe } from '../interfaces/recipe';
import { catchError, tap } from 'rxjs/operators';  
import { environment } from '../../../environment/environment';


@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = `${environment.baseUrl}recipes/`;
  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Fetch recipes error:', error);
        return throwError(() => error);
      })
    );
  } 

  createRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}create/`, recipe).pipe(
      tap(response => console.log('Recipe created:', response)),
      catchError(error => {
        console.error('Create recipe error:', error);
        return throwError(() => error);
      })
    );
  }

 editRecipe(recipeId: number, updatedData: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}update/${recipeId}/`, updatedData).pipe(
      catchError(error => {
        console.error('Edit recipe error:', error);
        return throwError(() => error);
      })
    );
  } 

  deleteRecipe(recipeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${recipeId}/`).pipe(
      catchError(error => {
        console.error('Delete recipe error:', error);
        return throwError(() => error);
      })
    );
  }

  getPublicRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.baseUrl}recipes/public/`, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        console.error('Fetch public recipes error:', error);
        return throwError(() => error);
      })
    );
  }
}  
