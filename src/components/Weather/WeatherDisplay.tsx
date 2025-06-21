import React from 'react';
import { CurrentWeather, DailyTemperatureAnalysis } from '../../types/weather';
import { weatherService } from '../../services/weatherApi';

interface WeatherDisplayProps {
  weather: CurrentWeather;
  temperatureAnalysis?: DailyTemperatureAnalysis;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weather, 
  temperatureAnalysis 
}) => {
  const currentTemp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const weatherCondition = weather.weather[0];
  const iconUrl = weatherService.getWeatherIconUrl(weatherCondition.icon);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{weather.name}</h2>
          <p className="text-gray-600">{weatherCondition.description}</p>
        </div>
        <div className="flex items-center">
          <img 
            src={iconUrl} 
            alt={weatherCondition.description}
            className="w-16 h-16"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">
            {currentTemp}°C
          </div>
          <div className="text-sm text-gray-600">
            Current
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">
            {feelsLike}°C
          </div>
          <div className="text-sm text-gray-600">
            Feels like
          </div>
        </div>
      </div>

      {temperatureAnalysis && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Today's Temperature Range</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-blue-700">
                {Math.round(temperatureAnalysis.morning)}°C
              </div>
              <div className="text-sm text-blue-600">Morning</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-orange-700">
                {Math.round(temperatureAnalysis.afternoon)}°C
              </div>
              <div className="text-sm text-orange-600">Afternoon</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-lg font-semibold text-purple-700">
                {Math.round(temperatureAnalysis.evening)}°C
              </div>
              <div className="text-sm text-purple-600">Evening</div>
            </div>
          </div>
          
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>Low: {Math.round(temperatureAnalysis.min)}°C</span>
            <span>High: {Math.round(temperatureAnalysis.max)}°C</span>
          </div>
        </div>
      )}

      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Humidity:</span>
            <span className="font-medium">{weather.main.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Wind:</span>
            <span className="font-medium">{Math.round(weather.wind.speed)} m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pressure:</span>
            <span className="font-medium">{weather.main.pressure} hPa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Visibility:</span>
            <span className="font-medium">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};