export interface GeneratedRecipe {
  id?: number;
  title: string;
  ingredients: { name: string; quantity: string }[];
  steps: { description: string }[];
  image?: string;
}

 