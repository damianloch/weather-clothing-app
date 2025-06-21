export interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'outerwear' | 'footwear' | 'accessories';
  warmthLevel: number; // 1-5 scale
  description: string;
  icon?: string;
}

export interface ClothingRecommendation {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'all-day';
  temperature: number;
  weatherCondition: string;
  items: ClothingItem[];
  layeringStrategy?: string;
  notes?: string;
}

export interface DailyClothingRecommendation {
  date: string;
  recommendations: ClothingRecommendation[];
  summary: string;
  layeringAdvice?: string;
  specialNotes?: string;
}

export interface UserPreferences {
  temperatureTolerance: 'cold' | 'normal' | 'warm';
  style: 'casual' | 'business' | 'athletic' | 'mixed';
  activityLevel: 'low' | 'moderate' | 'high';
  preferredColors?: string[];
}

export interface RecommendationContext {
  temperature: number;
  weatherCondition: string;
  humidity: number;
  windSpeed: number;
  timeOfDay: string;
  userPreferences?: UserPreferences;
}

export type TemperatureRange = 'freezing' | 'cold' | 'cool' | 'mild' | 'warm' | 'hot';
export type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist';