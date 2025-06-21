export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherInfo {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface CurrentWeather {
  coord: Coord;
  weather: WeatherData[];
  base: string;
  main: MainWeatherInfo;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface HourlyWeatherItem {
  dt: number;
  main: MainWeatherInfo;
  weather: WeatherData[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface HourlyWeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: HourlyWeatherItem[];
  city: {
    id: number;
    name: string;
    coord: Coord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyTemperatureAnalysis {
  morning: number;
  afternoon: number;
  evening: number;
  min: number;
  max: number;
  average: number;
  variance: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}