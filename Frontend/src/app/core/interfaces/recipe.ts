export interface Recipe {
  id?: number;
  title: string;
  description: string;
  ingredients: string[];  
  steps: string[];
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
