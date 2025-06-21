import { CurrentWeather, HourlyWeatherResponse, LocationData, DailyTemperatureAnalysis } from '../types/weather';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.warn('OpenWeatherMap API key not found. Weather features will not work.');
}

export class WeatherService {
  private static instance: WeatherService;

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is required');
    }

    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getHourlyForecast(lat: number, lon: number): Promise<HourlyWeatherResponse> {
    if (!API_KEY) {
      throw new Error('OpenWeatherMap API key is required');
    }

    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  analyzeDailyTemperatures(hourlyData: HourlyWeatherResponse): DailyTemperatureAnalysis {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Filter for today's data
    const todayData = hourlyData.list.filter(item => {
      const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
      return itemDate === todayStr;
    });

    if (todayData.length === 0) {
      // If no today's data, use next available data
      const fallbackData = hourlyData.list.slice(0, 8); // Next 24 hours
      return this.processTemperatureData(fallbackData);
    }

    return this.processTemperatureData(todayData);
  }

  private processTemperatureData(data: any[]): DailyTemperatureAnalysis {
    const temperatures = data.map(item => item.main.temp);

    // Calculate basic stats
    const min = Math.min(...temperatures);
    const max = Math.max(...temperatures);
    const average = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    
    // Calculate variance
    const variance = temperatures.reduce((sum, temp) => sum + Math.pow(temp - average, 2), 0) / temperatures.length;

    // Determine time-of-day temperatures
    const morning = this.getTemperatureForTimeRange(data, 6, 10);
    const afternoon = this.getTemperatureForTimeRange(data, 12, 16);
    const evening = this.getTemperatureForTimeRange(data, 18, 22);

    return {
      morning: morning || min,
      afternoon: afternoon || max,
      evening: evening || average,
      min,
      max,
      average,
      variance,
    };
  }

  private getTemperatureForTimeRange(data: any[], startHour: number, endHour: number): number | null {
    const filteredData = data.filter(item => {
      const hour = new Date(item.dt * 1000).getHours();
      return hour >= startHour && hour <= endHour;
    });

    if (filteredData.length === 0) return null;

    const temps = filteredData.map(item => item.main.temp);
    return temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
  }

  kelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export const weatherService = WeatherService.getInstance();