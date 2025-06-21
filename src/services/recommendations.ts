import {
  ClothingItem,
  ClothingRecommendation,
  DailyClothingRecommendation,
  UserPreferences,
  TemperatureRange
} from '../types/recommendations';
import { DailyTemperatureAnalysis } from '../types/weather';

export class RecommendationService {
  private static instance: RecommendationService;

  public static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  private clothingDatabase: ClothingItem[] = [
    // Outerwear
    { id: 'heavy-coat', name: 'Heavy Winter Coat', category: 'outerwear', warmthLevel: 5, description: 'Insulated winter coat for freezing temperatures' },
    { id: 'winter-jacket', name: 'Winter Jacket', category: 'outerwear', warmthLevel: 4, description: 'Warm jacket for cold weather' },
    { id: 'light-jacket', name: 'Light Jacket', category: 'outerwear', warmthLevel: 3, description: 'Light jacket or windbreaker' },
    { id: 'cardigan', name: 'Cardigan/Sweater', category: 'outerwear', warmthLevel: 2, description: 'Light cardigan or pullover sweater' },
    { id: 'hoodie', name: 'Hoodie', category: 'outerwear', warmthLevel: 2, description: 'Casual hoodie or light sweater' },

    // Tops
    { id: 'thermal-shirt', name: 'Thermal Long Sleeve', category: 'top', warmthLevel: 4, description: 'Thermal or heavy long-sleeve shirt' },
    { id: 'long-sleeve', name: 'Long Sleeve Shirt', category: 'top', warmthLevel: 3, description: 'Regular long-sleeve shirt' },
    { id: 'short-sleeve', name: 'T-Shirt', category: 'top', warmthLevel: 2, description: 'Short-sleeve t-shirt' },
    { id: 'tank-top', name: 'Tank Top', category: 'top', warmthLevel: 1, description: 'Sleeveless top for hot weather' },

    // Bottoms
    { id: 'thermal-pants', name: 'Thermal Pants', category: 'bottom', warmthLevel: 4, description: 'Insulated pants for very cold weather' },
    { id: 'jeans', name: 'Jeans/Long Pants', category: 'bottom', warmthLevel: 3, description: 'Regular jeans or long pants' },
    { id: 'light-pants', name: 'Light Pants', category: 'bottom', warmthLevel: 2, description: 'Light pants or chinos' },
    { id: 'shorts', name: 'Shorts', category: 'bottom', warmthLevel: 1, description: 'Shorts for warm weather' },

    // Footwear
    { id: 'winter-boots', name: 'Winter Boots', category: 'footwear', warmthLevel: 4, description: 'Insulated boots for cold/snowy weather' },
    { id: 'closed-shoes', name: 'Closed Shoes', category: 'footwear', warmthLevel: 3, description: 'Regular shoes or sneakers' },
    { id: 'light-shoes', name: 'Light Shoes', category: 'footwear', warmthLevel: 2, description: 'Canvas shoes or light sneakers' },
    { id: 'sandals', name: 'Sandals', category: 'footwear', warmthLevel: 1, description: 'Open sandals for hot weather' },

    // Accessories
    { id: 'winter-accessories', name: 'Winter Accessories', category: 'accessories', warmthLevel: 4, description: 'Hat, gloves, scarf for cold weather' },
    { id: 'light-accessories', name: 'Light Accessories', category: 'accessories', warmthLevel: 2, description: 'Light scarf or hat' },
    { id: 'sun-accessories', name: 'Sun Protection', category: 'accessories', warmthLevel: 1, description: 'Sunglasses, hat for sun protection' },
  ];

  generateDailyRecommendation(
    temperatureAnalysis: DailyTemperatureAnalysis,
    weatherCondition: string,
    userPreferences?: UserPreferences
  ): DailyClothingRecommendation {
    const recommendations: ClothingRecommendation[] = [];
    const variance = temperatureAnalysis.variance;
    const isVariableDay = variance > 25; // High temperature variance

    if (isVariableDay) {
      // Variable temperature day - provide layering strategy
      recommendations.push(
        this.generateLayeredRecommendation(temperatureAnalysis, weatherCondition, userPreferences)
      );
    } else {
      // Stable temperature - single recommendation
      recommendations.push(
        this.generateStableRecommendation(temperatureAnalysis.average, weatherCondition, userPreferences)
      );
    }

    return {
      date: new Date().toISOString().split('T')[0],
      recommendations,
      summary: this.generateSummary(temperatureAnalysis, weatherCondition, isVariableDay),
      layeringAdvice: isVariableDay ? this.generateLayeringAdvice(temperatureAnalysis) : undefined,
      specialNotes: this.generateSpecialNotes(weatherCondition, temperatureAnalysis),
    };
  }

  private generateLayeredRecommendation(
    analysis: DailyTemperatureAnalysis,
    weatherCondition: string,
    userPreferences?: UserPreferences
  ): ClothingRecommendation {
    const baseTemp = Math.min(analysis.morning, analysis.evening);
    const maxTemp = analysis.afternoon;
    
    // Base layer for the cooler parts of the day
    const baseItems = this.getClothingForTemperature(baseTemp, weatherCondition);
    
    // Removable layer for when it gets warmer
    const removableLayer = this.getRemovableLayer(maxTemp - baseTemp);
    
    const allItems = [...baseItems];
    if (removableLayer) {
      allItems.push(removableLayer);
    }

    return {
      id: 'layered-recommendation',
      timeOfDay: 'all-day',
      temperature: analysis.average,
      weatherCondition,
      items: allItems,
      layeringStrategy: this.getLayeringStrategy(analysis),
      notes: `Temperature varies from ${Math.round(analysis.min)}°C to ${Math.round(analysis.max)}°C today.`,
    };
  }

  private generateStableRecommendation(
    temperature: number,
    weatherCondition: string,
    userPreferences?: UserPreferences
  ): ClothingRecommendation {
    const items = this.getClothingForTemperature(temperature, weatherCondition);

    return {
      id: 'stable-recommendation',
      timeOfDay: 'all-day',
      temperature,
      weatherCondition,
      items,
      notes: `Consistent temperature around ${Math.round(temperature)}°C today.`,
    };
  }

  private getClothingForTemperature(temp: number, weatherCondition: string): ClothingItem[] {
    const items: ClothingItem[] = [];
    const tempRange = this.getTemperatureRange(temp);
    const hasRain = weatherCondition.toLowerCase().includes('rain');
    const hasSnow = weatherCondition.toLowerCase().includes('snow');

    // Determine clothing based on temperature
    switch (tempRange) {
      case 'freezing': // < 0°C
        items.push(
          this.getItem('heavy-coat'),
          this.getItem('thermal-shirt'),
          this.getItem('thermal-pants'),
          this.getItem('winter-boots'),
          this.getItem('winter-accessories')
        );
        break;

      case 'cold': // 0-10°C
        items.push(
          this.getItem('winter-jacket'),
          this.getItem('long-sleeve'),
          this.getItem('jeans'),
          this.getItem('closed-shoes')
        );
        if (temp < 5) {
          items.push(this.getItem('winter-accessories'));
        }
        break;

      case 'cool': // 10-18°C
        items.push(
          this.getItem('light-jacket'),
          this.getItem('long-sleeve'),
          this.getItem('jeans'),
          this.getItem('closed-shoes')
        );
        break;

      case 'mild': // 18-25°C
        items.push(
          this.getItem('short-sleeve'),
          this.getItem('light-pants'),
          this.getItem('light-shoes')
        );
        if (temp < 20) {
          items.push(this.getItem('cardigan'));
        }
        break;

      case 'warm': // 25-30°C
        items.push(
          this.getItem('short-sleeve'),
          this.getItem('shorts'),
          this.getItem('light-shoes'),
          this.getItem('sun-accessories')
        );
        break;

      case 'hot': // > 30°C
        items.push(
          this.getItem('tank-top'),
          this.getItem('shorts'),
          this.getItem('sandals'),
          this.getItem('sun-accessories')
        );
        break;
    }

    // Weather-specific adjustments
    if (hasRain) {
      // Replace light jacket with waterproof option if temp allows
      items.forEach((item, index) => {
        if (item.id === 'light-jacket') {
          items[index] = { ...item, name: 'Rain Jacket', description: 'Waterproof jacket for rainy weather' };
        }
      });
    }

    if (hasSnow && tempRange !== 'freezing') {
      // Upgrade footwear for snow
      items.forEach((item, index) => {
        if (item.category === 'footwear' && item.warmthLevel < 4) {
          items[index] = this.getItem('winter-boots');
        }
      });
    }

    return items.filter(Boolean);
  }

  private getRemovableLayer(tempDifference: number): ClothingItem | null {
    if (tempDifference > 15) {
      return this.getItem('light-jacket');
    } else if (tempDifference > 10) {
      return this.getItem('cardigan');
    } else if (tempDifference > 5) {
      return this.getItem('hoodie');
    }
    return null;
  }

  private getTemperatureRange(temp: number): TemperatureRange {
    if (temp < 0) return 'freezing';
    if (temp < 10) return 'cold';
    if (temp < 18) return 'cool';
    if (temp < 25) return 'mild';
    if (temp < 30) return 'warm';
    return 'hot';
  }

  private getItem(id: string): ClothingItem {
    const item = this.clothingDatabase.find(item => item.id === id);
    if (!item) {
      throw new Error(`Clothing item not found: ${id}`);
    }
    return item;
  }

  private getLayeringStrategy(analysis: DailyTemperatureAnalysis): string {
    const morning = Math.round(analysis.morning);
    const afternoon = Math.round(analysis.afternoon);
    const evening = Math.round(analysis.evening);

    return `Start with layers for ${morning}°C morning, remove outer layer when it reaches ${afternoon}°C in the afternoon, and add back for ${evening}°C evening.`;
  }

  private generateSummary(
    analysis: DailyTemperatureAnalysis,
    weatherCondition: string,
    isVariable: boolean
  ): string {
    const min = Math.round(analysis.min);
    const max = Math.round(analysis.max);
    
    if (isVariable) {
      return `Variable day with temperatures from ${min}°C to ${max}°C. Layering recommended for comfort throughout the day.`;
    } else {
      return `Stable temperature around ${Math.round(analysis.average)}°C with ${weatherCondition.toLowerCase()} conditions.`;
    }
  }

  private generateLayeringAdvice(analysis: DailyTemperatureAnalysis): string {
    const tempDiff = analysis.max - analysis.min;
    
    if (tempDiff > 20) {
      return "High temperature variation today. Consider multiple removable layers to adjust throughout the day.";
    } else if (tempDiff > 15) {
      return "Moderate temperature changes expected. A removable jacket or sweater should be sufficient.";
    } else {
      return "Some temperature variation. A light layer you can remove should work well.";
    }
  }

  private generateSpecialNotes(weatherCondition: string, analysis: DailyTemperatureAnalysis): string {
    const notes: string[] = [];
    
    if (weatherCondition.toLowerCase().includes('rain')) {
      notes.push("Rain expected - consider waterproof outerwear and closed shoes.");
    }
    
    if (weatherCondition.toLowerCase().includes('snow')) {
      notes.push("Snow conditions - wear appropriate footwear with good traction.");
    }
    
    if (weatherCondition.toLowerCase().includes('wind')) {
      notes.push("Windy conditions - consider wind-resistant layers.");
    }
    
    if (analysis.max > 30) {
      notes.push("Hot weather - stay hydrated and seek shade when possible.");
    }
    
    if (analysis.min < 0) {
      notes.push("Freezing temperatures - cover exposed skin and stay warm.");
    }
    
    return notes.join(' ');
  }
}

export const recommendationService = RecommendationService.getInstance();