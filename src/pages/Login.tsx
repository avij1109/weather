import React, { useEffect, useState } from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Cloud, CloudRain, CloudSnow, Sun, Umbrella, Wind } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  const [animationItems, setAnimationItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Determine time of day for appropriate background
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) {
      setTimeOfDay('morning');
    } else if (hour >= 10 && hour < 17) {
      setTimeOfDay('day');
    } else if (hour >= 17 && hour < 20) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }

    // Create animation items based on time of day
    const items: React.ReactNode[] = [];
    const count = Math.floor(window.innerWidth / 100);
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 24 + 16;
      const speed = Math.random() * 20 + 60;
      const delay = Math.random() * 15;
      const opacity = Math.random() * 0.4 + 0.2;
      const left = Math.random() * 100;
      
      if (timeOfDay === 'day' || timeOfDay === 'morning') {
        items.push(
          <div 
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              animation: `float ${speed}s linear infinite ${delay}s`,
              opacity: opacity,
            }}
          >
            <Cloud size={size} className="text-white" />
          </div>
        );
      } else if (timeOfDay === 'evening') {
        items.push(
          <div 
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              animation: `float ${speed}s linear infinite ${delay}s`,
              opacity: opacity,
            }}
          >
            {Math.random() > 0.5 ? 
              <Cloud size={size} className="text-zinc-300" /> : 
              <Wind size={size} className="text-zinc-300" />
            }
          </div>
        );
      } else {
        items.push(
          <div 
            key={i}
            className="absolute"
            style={{
              left: `${left}%`,
              animation: `float ${speed}s linear infinite ${delay}s`,
              opacity: opacity,
            }}
          >
            {Math.random() > 0.7 ? 
              <CloudSnow size={size} className="text-zinc-400" /> : 
              <CloudRain size={size} className="text-zinc-400" />
            }
          </div>
        );
      }
    }
    
    setAnimationItems(items);
  }, [timeOfDay]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // redirect after login
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const getBackgroundClass = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-amber-200 via-sky-300 to-blue-400';
      case 'day':
        return 'bg-gradient-to-br from-sky-300 via-blue-400 to-blue-500';
      case 'evening':
        return 'bg-gradient-to-br from-orange-300 via-pink-500 to-purple-600';
      case 'night':
        return 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900';
      default:
        return 'bg-gradient-to-br from-sky-300 via-blue-400 to-blue-500';
    }
  };

  const getWelcomeMessage = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'Good Morning';
      case 'day':
        return 'Good Day';
      case 'evening':
        return 'Good Evening';
      case 'night':
        return 'Good Night';
      default:
        return 'Welcome';
    }
  };

  const getWeatherIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun className="text-amber-400 h-10 w-10 mb-4" />;
      case 'day':
        return <Sun className="text-amber-500 h-10 w-10 mb-4" />;
      case 'evening':
        return <CloudRain className="text-indigo-400 h-10 w-10 mb-4" />;
      case 'night':
        return <CloudSnow className="text-blue-400 h-10 w-10 mb-4" />;
      default:
        return <Umbrella className="text-blue-500 h-10 w-10 mb-4" />;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center overflow-hidden relative ${getBackgroundClass()}`}>
      {/* Weather animation container */}
      <div className="absolute inset-0 overflow-hidden">
        {animationItems}
      </div>
      
      {/* Login card */}
      <div className="relative z-10 backdrop-blur-sm bg-white/30 dark:bg-slate-900/40 p-10 rounded-2xl shadow-xl border border-white/30 dark:border-white/10 w-full max-w-md mx-4 transition-all duration-500">
        <div className="flex flex-col items-center">
          {getWeatherIcon()}
          <h1 className="text-3xl font-bold mb-2 text-white dark:text-white drop-shadow-md">
            {getWelcomeMessage()}
          </h1>
          <h2 className="text-xl text-white/90 dark:text-white/80 mb-8 text-center font-light drop-shadow-sm">
            Sign in to check your weather forecast
          </h2>
          
          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 bg-white text-slate-800 hover:bg-slate-100 w-full px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
          
          <p className="mt-8 text-sm text-white/80 dark:text-white/60 text-center">
            By signing in, you agree to our Terms of Service<br /> and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;