import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../core/services/dashboard.service'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../core/interfaces/recipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myrecipes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './myrecipes.component.html',
  styleUrl: './myrecipes.component.css'
})

export class MyrecipesComponent implements OnInit {
  recipes: Recipe[] = [];  
  recipe: Recipe = {} as Recipe;  
  modalRecipe: any = null; 
  showModal: boolean = false; 
  currentSection: string = 'my-recipes'; 
  apiUrl = 'http://127.0.0.1:8000/api/recipes/';  

  constructor(
    private dashboardService: DashboardService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  getUserRecipes(): Observable<Recipe[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Nessun token nel localStorage');
      alert('Per vedere le ricette è necessario effettuare il login.');
      return throwError(() => new Error('Token non trovato'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Recipe[]>(this.apiUrl, { headers });
  }

  getRecipes(): void {
    this.getUserRecipes().subscribe(
      (data: Recipe[]) => {
        console.log('Recetas obtenidas:', data);
        this.recipes = data.map(recipe => ({
          ...recipe,
          image_url: recipe.image_url ? `http://localhost:8000${recipe.image_url}` : null
        }));
      },
      (error) => {
        console.error("Errore nell'ottenere le ricette", error);
      }
    );
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

  submitRecipe(): void {
    if (!this.recipe.title || !this.recipe.ingredients || !this.recipe.description) {
      alert('Completa tutti i campi.');
      return;
    }

    if (this.recipe.id) {
        this.dashboardService.editRecipe(this.recipe.id, this.recipe).subscribe(
        () => {
          alert('Ricetta modificata con successo!');
          this.getRecipes();
          this.showSection('my-recipes');
          this.recipe = {} as Recipe;
        },
        (error) => {
          console.error('Errore durante la modifica', error);
          alert('Errore nella modifica, controlla la console.');
        }
      );
    } else {      
      this.dashboardService.addRecipe(this.recipe).subscribe(
        (newRecipe) => {
          alert('Ricetta aggiunta con successo!');
          this.recipes.push(newRecipe);
          this.showSection('my-recipes');
          this.recipe = {} as Recipe;
        },
        (error) => {
          console.error('Errore nell\'aggiunta della ricetta', error);
          alert('Errore nell\'aggiunta, controlla la console.');
        }
      );
    }
  }

  deleteRecipe(id: number): void {
    if (!confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      return;
    }

    this.dashboardService.deleteRecipe(id).subscribe(
      () => {
        alert('Ricetta eliminata con successo!');
        this.getRecipes();
      },
      (error) => {
        console.error('Errore durante l\'eliminazione', error);
      }
    );
  }

  editRecipe(recipe: Recipe): void {
    this.recipe = { ...recipe }; 
    this.showSection('add-edit-delete-recipes');
  }

  viewDetails(recipe: Recipe): void {
    this.modalRecipe = recipe;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalRecipe = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
    }
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigateToRecipes(): void {
    this.router.navigate(['/recipes']);
  }
}
