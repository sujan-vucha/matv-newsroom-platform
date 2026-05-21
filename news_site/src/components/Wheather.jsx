// iWeather.jsx
import React from 'react';
import { FaSun, FaCloud, FaCloudRain, FaWind } from 'react-icons/fa';

const getWeatherIcon = (description) => {
  const d = description.toLowerCase();
  if (d.includes("sun")) return <FaSun className="text-4xl text-yellow-500" />;
  if (d.includes("cloud")) return <FaCloud className="text-4xl text-gray-600" />;
  if (d.includes("rain")) return <FaCloudRain className="text-4xl text-blue-600" />;
  if (d.includes("wind")) return <FaWind className="text-4xl text-gray-600" />;
  return <FaCloud className="text-4xl text-gray-400" />;
};

const weatherData = {
  name: "London",
  temp: "17°C",
  condition: "Partly Cloudy",
  forecast: [
    { day: "Tue", temp: "18°C", condition: "Sunny" },
    { day: "Wed", temp: "16°C", condition: "Light Rain" },
    { day: "Thu", temp: "17°C", condition: "Windy" },
  ]
};

const iWeather = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Live Weather</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{weatherData.name}</h3>
                <p className="text-gray-600 capitalize">{weatherData.condition}</p>
              </div>
              {getWeatherIcon(weatherData.condition)}
            </div>

            <div className="text-5xl font-bold text-gray-800 mb-4">{weatherData.temp}</div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">3-Day Forecast</h4>
              <div className="flex justify-between">
                {weatherData.forecast.map((day, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-gray-600 text-sm">{day.day}</p>
                    <div className="text-orange-600 my-1">{getWeatherIcon(day.condition)}</div>
                    <p className="text-sm font-semibold">{day.temp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default iWeather;
