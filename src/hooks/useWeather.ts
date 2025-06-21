import { useState, useEffect, useCallback } from 'react';
import { CurrentWeather, HourlyWeatherResponse, DailyTemperatureAnalysis, LocationData } from '../types/weather';
import { weatherService } from '../services/weatherApi';

interface UseWeatherState {
  currentWeather: CurrentWeather | null;
  hourlyForecast: HourlyWeatherResponse | null;
  temperatureAnalysis: DailyTemperatureAnalysis | null;
  loading: boolean;
  error: string | null;
}

interface UseWeatherReturn extends UseWeatherState {
  fetchWeather: (location: LocationData) => Promise<void>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useWeather = (initialLocation?: LocationData): UseWeatherReturn => {
  const [state, setState] = useState<UseWeatherState>({
    currentWeather: null,
    hourlyForecast: null,
    temperatureAnalysis: null,
    loading: false,
    error: null,
  });

  const [location, setLocation] = useState<LocationData | null>(initialLocation || null);

  const fetchWeather = useCallback(async (locationData: LocationData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [current, hourly] = await Promise.all([
        weatherService.getCurrentWeather(locationData.latitude, locationData.longitude),
        weatherService.getHourlyForecast(locationData.latitude, locationData.longitude),
      ]);

      const analysis = weatherService.analyzeDailyTemperatures(hourly);

      setState({
        currentWeather: current,
        hourlyForecast: hourly,
        temperatureAnalysis: analysis,
        loading: false,
        error: null,
      });

      setLocation(locationData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const refetch = useCallback(async () => {
    if (location) {
      await fetchWeather(location);
    }
  }, [location, fetchWeather]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch weather when initial location is provided
  useEffect(() => {
    if (initialLocation && !state.currentWeather && !state.loading) {
      fetchWeather(initialLocation);
    }
  }, [initialLocation, fetchWeather, state.currentWeather, state.loading]);

  return {
    ...state,
    fetchWeather,
    refetch,
    clearError,
  };
};
//trigger
