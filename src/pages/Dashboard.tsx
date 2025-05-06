// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { auth, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Sun, Cloud, CloudRain, Wind, Droplets, Eye, Gauge, Thermometer, MapPin, ChevronDown, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("Delhi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      setCity(cityName);
    } catch (err) {
      console.error("Failed to fetch weather", err);
      setError("Could not find weather data for this location. Please try another city.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleCitySelect = (selectedCity: string) => {
    fetchWeather(selectedCity);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Helper function to get appropriate weather icon
  const getWeatherIcon = (iconCode: string) => {
    if (!weather) return <Sun size={48} />;
    
    // Map OpenWeatherMap icon codes to Lucide icons
    const iconMap: Record<string, React.ReactNode> = {
      '01d': <Sun size={48} className="text-yellow-400" />,
      '01n': <Sun size={48} className="text-yellow-400" />,
      '02d': <Cloud size={48} className="text-gray-400" />,
      '02n': <Cloud size={48} className="text-gray-400" />,
      '03d': <Cloud size={48} className="text-gray-400" />,
      '03n': <Cloud size={48} className="text-gray-400" />,
      '04d': <Cloud size={48} className="text-gray-400" />,
      '04n': <Cloud size={48} className="text-gray-400" />,
      '09d': <CloudRain size={48} className="text-blue-400" />,
      '09n': <CloudRain size={48} className="text-blue-400" />,
      '10d': <CloudRain size={48} className="text-blue-400" />,
      '10n': <CloudRain size={48} className="text-blue-400" />,
      '11d': <CloudRain size={48} className="text-blue-500" />,
      '11n': <CloudRain size={48} className="text-blue-500" />,
      '13d': <Cloud size={48} className="text-blue-200" />,
      '13n': <Cloud size={48} className="text-blue-200" />,
      '50d': <Wind size={48} className="text-gray-300" />,
      '50n': <Wind size={48} className="text-gray-300" />
    };

    return iconMap[iconCode] || <Sun size={48} className="text-yellow-400" />;
  };

  // Format the date
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Date for the forecast
  const currentDate = formatDate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 flex flex-col">
      {/* Header with navigation */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-yellow-300 mr-2">
              <Sun size={28} />
            </div>
            <h1 className="text-xl font-bold text-white">WeatherApp</h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user?.displayName || "User"} 
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              )}
              <span className="text-white text-sm font-medium hidden md:block">
                {user?.displayName || "User"}
              </span>
              <ChevronDown size={16} className="text-white/70" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                  Signed in as<br />
                  <span className="font-medium">{user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search bar section */}
          <div className="mb-8">
            <SearchBar onCitySelect={handleCitySelect} initialCity={city} />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-lg mb-6 animate-fade-in">
              <p className="flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Weather display */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-white/80">Fetching weather data...</p>
            </div>
          ) : weather ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              {/* Main weather info */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <MapPin size={20} className="text-white/80 mr-2" />
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{weather.name}</h2>
                      <span className="ml-2 bg-white/20 text-white px-2 py-0.5 rounded text-xs">
                        {weather.sys.country}
                      </span>
                    </div>
                    <p className="text-white/70 mt-1">{currentDate}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    {getWeatherIcon(weather.weather[0].icon)}
                    <div className="ml-4">
                      <div className="flex items-end">
                        <span className="text-4xl md:text-5xl font-bold text-white">
                          {Math.round(weather.main.temp)}
                        </span>
                        <span className="text-xl text-white/70 mb-1">°C</span>
                      </div>
                      <p className="text-white/80 capitalize">
                        {weather.weather[0].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed weather stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 md:p-8 bg-indigo-900/50 border-t border-white/10">
                <div className="bg-white/10 p-4 rounded-lg flex flex-col items-center">
                  <Thermometer size={24} className="text-red-400 mb-2" />
                  <p className="text-xs text-white/70 mb-1">Feels Like</p>
                  <p className="text-xl font-semibold text-white">{Math.round(weather.main.feels_like)}°C</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg flex flex-col items-center">
                  <Droplets size={24} className="text-blue-400 mb-2" />
                  <p className="text-xs text-white/70 mb-1">Humidity</p>
                  <p className="text-xl font-semibold text-white">{weather.main.humidity}%</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg flex flex-col items-center">
                  <Wind size={24} className="text-green-400 mb-2" />
                  <p className="text-xs text-white/70 mb-1">Wind Speed</p>
                  <p className="text-xl font-semibold text-white">{weather.wind.speed} m/s</p>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg flex flex-col items-center">
                  <Gauge size={24} className="text-yellow-400 mb-2" />
                  <p className="text-xs text-white/70 mb-1">Pressure</p>
                  <p className="text-xl font-semibold text-white">{weather.main.pressure} hPa</p>
                </div>
              </div>

              {/* Additional info */}
              <div className="grid grid-cols-2 gap-3 p-6 md:p-8 bg-indigo-900/30 border-t border-white/10">
                <div className="flex items-center">
                  <Eye size={20} className="text-white/60 mr-2" />
                  <div>
                    <p className="text-xs text-white/70">Visibility</p>
                    <p className="text-md font-medium text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
                  </div>
                </div>
                
                {weather.sys && (
                  <div className="flex items-center">
                    <Sun size={20} className="text-yellow-400 mr-2" />
                    <div>
                      <p className="text-xs text-white/70">Sunrise & Sunset</p>
                      <p className="text-md font-medium text-white">
                        {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} / {' '}
                        {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center text-white/80">
              <p>No weather data available. Please search for a city.</p>
            </div>
          )}

          {/* Tips section */}
          {weather && !loading && (
            <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-white mb-3">Weather Tips</h3>
              <p className="text-white/80">
                {weather.main.temp > 30 ? 
                  "It's hot today! Stay hydrated and try to remain in shaded or air-conditioned areas." :
                weather.main.temp > 20 ? 
                  "Pleasant weather today. Great time for outdoor activities!" :
                weather.main.temp > 10 ? 
                  "It's a bit cool. Consider wearing a light jacket." :
                "It's cold out there! Bundle up with warm clothes."}
                
                {weather.weather[0].main === "Rain" &&
                  " Don't forget your umbrella!"}
                
                {weather.wind.speed > 10 &&
                  " Strong winds today, secure loose objects outdoors."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-4">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>© 2025 WeatherApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;