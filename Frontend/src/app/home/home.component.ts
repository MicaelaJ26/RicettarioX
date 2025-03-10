import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';

interface Recipe {
  id: number;
  title: string;
  image: string;
  ingredients: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
 
  recipes: Recipe[] = [
    {
      id: 1,
      title: 'Prova questo piatto straordinario di Carne con patate !',
      image: 'assets/img/carneconpapas.jpg',
      ingredients: 'Ingredienti:500g di carne di manzo a pezzi, 4 patate grandi,1 cipolla, 2 spicchi d’aglio, 200ml di brodo di carne, Olio d’oliva, sale e pepe q.b.',
      description: 'Preparazione: Scalda l’olio in una padella e rosola la carne fino a doratura. Aggiungi la cipolla e l’aglio tritati, cuoci per qualche minuto e unisci le patate a pezzi. Versa il brodo, copri e lascia cuocere a fuoco medio per 40 minuti. Aggiusta di sale e pepe prima di servire.'
    },
    {
      id: 2,
      title: 'Pizza di Broccoli sana e gustosa!',
      image: 'assets/img/pizzabrocoli.jpg',
      ingredients: 'Ingredienti: 1 base per pizza, 150g di broccoli lessati, 100g di mozzarella, 2 cucchiai di parmigiano grattugiato, Olio d’oliva, sale e pepe q.b.',
      description: 'Preparazione: Stendi la base della pizza su una teglia. Distribuisci sopra i broccoli tagliati, la mozzarella a pezzi e il parmigiano. Condisci con un filo d’olio, sale e pepe. Inforna a 220°C per circa 15 minuti o fino a doratura.'
    },
    {
      id: 3,
      title: 'Moscaccioni con pancetta una pasta che amerai!',
      image: 'assets/img/pasta.jpg',
      ingredients: 'Ingredienti: 200g di mostaccioli, 100g di pancetta a cubetti, 1 cipolla, 200ml di panna da cucina, 50g di parmigiano, Olio d’oliva, sale e pepe q.b.',
      description: 'Preparazione: Cuoci i mostaccioli in acqua salata. Nel frattempo, soffriggi la cipolla tritata in olio, aggiungi la pancetta e cuoci fino a doratura. Versa la panna e mescola. Scola la pasta e amalgamala con il condimento. Aggiungi parmigiano e servi caldo.'
    }
  ];

  showModal = signal(false);
  selectedRecipe = signal<Recipe | null>(null)

  constructor(private router: Router) {}
  
  ngOnInit(): void {}
  
openModal(recipe: Recipe): void {
  this.selectedRecipe.set(recipe);
  this.showModal.set(true);
}

closeModal(): void {
  this.showModal.set(false);
  this.selectedRecipe.set(null);
}
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
