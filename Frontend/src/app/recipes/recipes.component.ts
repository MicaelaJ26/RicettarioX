import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeService } from '../core/services/recipe.service';
import { Recipe } from '../core/interfaces/recipe';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recipes',
  standalone: true,
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
  imports: [CommonModule, HttpClientModule],  
})
export class RecipesComponent implements OnInit {
  
  recipes: Recipe[] = [];  
  selectedRecipe: Recipe | null = null;  
  showModal: boolean = false;  

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes(): void {
    this.recipeService.getPublicRecipes().subscribe(
      (data: Recipe[]) => {
        console.log('Ricette ottenute:', data);
        this.recipes = data;
      },
      (error) => {
        console.error("Errore nell'ottenere le ricette", error);
      }
    );
  }
  
  showRecipeDetails(recipe: Recipe): void {
    this.selectedRecipe = recipe;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.selectedRecipe = null;
  }
}
