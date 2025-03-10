import { Component } from '@angular/core';
import { GeneratedRecipeService } from '../core/services/generated-recipe.service';
import { GeneratedRecipe } from '../core/interfaces/generated-recipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-mix-it-up',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './mix-it-up.component.html',
  styleUrls: ['./mix-it-up.component.css'],
  providers: [DatePipe] 
})
export class MixItUpComponent {
  ingredients: string[] = [];
  newIngredient: string = '';
  generatedRecipe: GeneratedRecipe | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  formVisible: boolean = false;

  constructor(
    private generatedRecipeService: GeneratedRecipeService,
    private datePipe: DatePipe 
  ) {}

  toggleForm() {
    this.formVisible = !this.formVisible;
    this.generatedRecipe = null;
  }

  addIngredient() {
    if (this.newIngredient && !this.ingredients.includes(this.newIngredient)) {
      this.ingredients.push(this.newIngredient);
      this.newIngredient = ''; 
      this.errorMessage = '';  
    } else {
      this.errorMessage = 'Por favor, ingresa un ingrediente válido o único.';
    }
  }

  removeIngredient(ingredient: string) {
    this.ingredients = this.ingredients.filter((item) => item !== ingredient);
  }

  generateRecipe() {
    if (this.ingredients.length === 0) {
      this.errorMessage = '¡Por favor, agrega al menos un ingrediente!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.generatedRecipeService.mixItUp(this.ingredients).subscribe({
      next: (recipe: GeneratedRecipe) => {
        this.generatedRecipe = recipe;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Hubo un error al generar la receta. Intenta de nuevo.';
        this.loading = false;
      },
    });
    
  }
}
