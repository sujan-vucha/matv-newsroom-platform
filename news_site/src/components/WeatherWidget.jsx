import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
    // Update weather every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      
      // Fetch weather data from OpenWeatherMap API
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
      
      if (!API_KEY) {
        console.warn('OpenWeatherMap API key not configured, using fallback data');
        setFallbackWeather();
        return;
      }
      
      try {
        // Get user's location
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (locationError) {
        console.warn('Location or API error:', locationError);
        setFallbackWeather();
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setFallbackWeather();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackWeather = () => {
    setError(null);
    setWeather({
      name: 'New Delhi',
      main: {
        temp: 28,
        feels_like: 32,
        humidity: 65,
        pressure: 1013
      },
      weather: [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: 3.5
      },
      visibility: 10000
    });
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true
      });
    });
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="w-5 h-5 text-blue-300" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-300">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-xs">Loading weather...</span>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="flex items-center space-x-2 text-gray-300">
        <Cloud className="w-4 h-4" />
        <span className="text-xs">Weather unavailable</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 text-gray-800">
      {/* Main Weather Display */}
      <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg px-4 py-2 shadow-lg">
        {getWeatherIcon(weather?.weather?.[0]?.main)}
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold">{Math.round(weather?.main?.temp)}°C</span>
            <span className="text-xs text-blue-100">{weather?.name}</span>
          </div>
          <span className="text-xs text-blue-100 capitalize">
            {weather?.weather?.[0]?.description}
          </span>
        </div>
      </div>

      {/* Weather Details Tooltip */}
      <div className="flex items-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <Thermometer className="w-3 h-3" />
          <span>Feels {Math.round(weather?.main?.feels_like)}°</span>
        </div>
        <div className="flex items-center space-x-1">
          <Droplets className="w-3 h-3" />
          <span>{weather?.main?.humidity}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <Wind className="w-3 h-3" />
          <span>{weather?.wind?.speed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;