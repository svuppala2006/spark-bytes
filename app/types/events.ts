
export interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  description?: string;
  image_url?: string;
  image?: string;
  food?: string[];
  foodType?: string;
  allergens?: string[];
}