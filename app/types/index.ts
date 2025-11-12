export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'halal'
  | 'kosher'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'peanut-free'
  | 'no-pork';

export type StockLevel = 'high' | 'medium' | 'low';

export interface FoodItem {
  id: string;
  name: string;
  quantity?: number; // For countable items (e.g., 8 pizza slices)
  stockLevel?: StockLevel; // For bulk items (e.g., rice, beans)
  dietaryTags: DietaryTag[];
  description?: string;
  image?: string; // URL to food image
}

export interface Event {
  id: number;
  name: string;
  location: string;
  foodItems: FoodItem[];
  image: string;
  time: string;
  description?: string;
}
