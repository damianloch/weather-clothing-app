import React, { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { useLocation } from './hooks/useLocation';
import { recommendationService } from './services/recommendations';
import { WeatherDisplay } from './components/Weather/WeatherDisplay';
import { RecommendationList } from './components/Recommendations/RecommendationList';
import { LoadingSpinner } from './components/Common/LoadingSpinner';
import { ErrorMessage } from './components/Common/ErrorMessage';
import { DailyClothingRecommendation } from './types/recommendations';

function App() {
  const [recommendation, setRecommendation] = useState<DailyClothingRecommendation | null>(null);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  
  const { 
    currentWeather, 
    temperatureAnalysis, 
    loading: weatherLoading, 
    error: weatherError, 
    fetchWeather,
    clearError: clearWeatherError
  } = useWeather();

  const {
    currentLocation,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
    clearError: clearLocationError
  } = useLocation();

  // Get user's location on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const location = await getCurrentLocation();
        await fetchWeather(location);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [getCurrentLocation, fetchWeather]);

  // Generate recommendations when weather data is available
  useEffect(() => {
    const generateRecommendations = async () => {
      if (currentWeather && temperatureAnalysis) {
        setIsGeneratingRecommendation(true);
        try {
          const dailyRecommendation = recommendationService.generateDailyRecommendation(
            temperatureAnalysis,
            currentWeather.weather[0].main
          );
          setRecommendation(dailyRecommendation);
        } catch (error) {
          console.error('Failed to generate recommendations:', error);
        } finally {
          setIsGeneratingRecommendation(false);
        }
      }
    };

    generateRecommendations();
  }, [currentWeather, temperatureAnalysis]);

  const handleRetryLocation = async () => {
    clearLocationError();
    try {
      const location = await getCurrentLocation();
      await fetchWeather(location);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleRetryWeather = async () => {
    clearWeatherError();
    if (currentLocation) {
      await fetchWeather(currentLocation);
    }
  };

  const isLoading = locationLoading || weatherLoading || isGeneratingRecommendation;
  const hasError = locationError || weatherError;

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2d3748', margin: '0 0 8px 0' }}>
            Weather Clothing Assistant
          </h1>
          <p style={{ color: '#4a5568', margin: '0' }}>
            Smart clothing recommendations based on today's weather patterns
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        {/* Loading State */}
        {isLoading && (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '48px 0' }}>
            <LoadingSpinner
              size="large"
              message={
                locationLoading ? "Getting your location..." :
                weatherLoading ? "Fetching weather data..." :
                isGeneratingRecommendation ? "Generating clothing recommendations..." :
                "Loading..."
              }
            />
          </div>
        )}

        {/* Error States */}
        {locationError && (
          <ErrorMessage
            error={locationError}
            onRetry={handleRetryLocation}
            onDismiss={clearLocationError}
          />
        )}

        {weatherError && (
          <ErrorMessage
            error={weatherError}
            onRetry={handleRetryWeather}
            onDismiss={clearWeatherError}
          />
        )}

        {/* Success State - Show Weather and Recommendations */}
        {currentWeather && temperatureAnalysis && !hasError && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <WeatherDisplay
              weather={currentWeather}
              temperatureAnalysis={temperatureAnalysis}
            />
            
            {recommendation && !isGeneratingRecommendation && (
              <RecommendationList recommendation={recommendation} />
            )}
            
            {isGeneratingRecommendation && (
              <div className="weather-card">
                <LoadingSpinner
                  size="medium"
                  message="Analyzing weather patterns and generating clothing recommendations..."
                />
              </div>
            )}
          </div>
        )}

        {/* No Location Permissions Message */}
        {!isLoading && !hasError && !currentWeather && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div className="weather-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📍</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '8px' }}>
                Location Access Required
              </h2>
              <p style={{ color: '#4a5568', marginBottom: '24px' }}>
                We need your location to provide accurate weather data and clothing recommendations.
              </p>
              <button
                onClick={handleRetryLocation}
                className="button"
              >
                Enable Location Access
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: 'white', borderTop: '1px solid #e2e8f0', marginTop: '48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <p>Weather data provided by OpenWeatherMap</p>
            <p style={{ marginTop: '4px' }}>
              Recommendations are based on general weather conditions.
              Please consider your personal preferences and activities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
