// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { auth, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar"; // Import the new SearchBar component

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "0f2675fb7b8717c74162975068e074eb";

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!res.ok) {
        throw new Error(`City not found or API error: ${res.statusText}`);
      }
      
      const data = await res.json();
      setWeather(data);
      setCity(cityName); // Update the current city
    } catch (err) {
      console.error("Failed to fetch weather", err);
      setError("Failed to fetch weather data. Please try another city.");
      // Keep the old weather data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []); // Only run on component mount

  const handleCitySelect = (selectedCity: string) => {
    fetchWeather(selectedCity);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">WeatherApp</h1>
        <div className="flex items-center gap-4">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="User"
              className="rounded-full w-10 h-10 border-2 border-white"
            />
          )}
          <span className="hidden md:inline">{user?.displayName}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <SearchBar onCitySelect={handleCitySelect} initialCity={city} />
      </div>

      {error && (
        <div className="bg-red-500/80 text-white p-4 rounded mb-6 w-full max-w-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : weather ? (
        <div className="bg-white/90 text-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold">{weather.name}</h2>
              <p className="text-gray-600">{weather.sys.country}</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
              <p className="text-gray-600">Feels like {Math.round(weather.main.feels_like)}°C</p>
            </div>
          </div>
          
          <div className="flex items-center mb-6">
            {weather.weather[0].icon && (
              <img 
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="w-16 h-16 mr-4"
              />
            )}
            <div>
              <p className="text-xl capitalize">{weather.weather[0].description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-semibold">{weather.main.humidity}%</p>
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-sm text-gray-600">Pressure</p>
              <p className="text-xl font-semibold">{weather.main.pressure} hPa</p>
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <p className="text-sm text-gray-600">Visibility</p>
              <p className="text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
};

export default Dashboard;