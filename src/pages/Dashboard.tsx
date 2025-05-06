// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { auth, signOut } from "../firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState("Delhi");

  const API_KEY = "0f2675fb7b8717c74162975068e074eb";

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather", err);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex flex-col items-center p-6">
      <div className="self-end">
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mt-4 mb-2">Welcome, {user?.displayName}</h1>
      {user?.photoURL && (
        <img
          src={user.photoURL}
          alt="User"
          className="rounded-full w-20 h-20 border-4 border-white mt-2 mb-4"
        />
      )}

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 rounded text-black"
          placeholder="Enter city"
        />
        <button onClick={fetchWeather} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
          Get Weather
        </button>
      </div>

      {weather ? (
        <div className="bg-white text-black p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <p className="text-lg">Temperature: {weather.main.temp}°C</p>
          <p className="text-md capitalize">Weather: {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default Dashboard;
