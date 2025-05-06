import { Link } from 'react-router-dom';
import { CloudSun, Sun, Cloud, CloudRain, Wind } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex flex-col">
      {/* Floating weather icons background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[10%] text-yellow-200/30 animate-float">
          <CloudSun size={48} />
        </div>
        <div className="absolute top-20 right-[15%] text-yellow-200/30 animate-float-delayed">
          <Sun size={36} />
        </div>
        <div className="absolute bottom-20 left-[20%] text-orange-200/30 animate-float">
          <Cloud size={42} />
        </div>
        <div className="absolute bottom-32 right-[25%] text-orange-200/30 animate-float-delayed">
          <CloudRain size={38} />
        </div>
        <div className="absolute top-1/2 left-[80%] text-yellow-200/30 animate-float">
          <Wind size={40} />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <Sun size={64} className="text-yellow-300" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Weather<span className="text-yellow-300">App</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-md mx-auto">
            Your personal weather companion. Get real-time updates and forecasts for any location worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-white/90 text-orange-600 rounded-lg font-semibold hover:bg-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 border border-orange-400/20"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
            <div className="text-yellow-300 mb-4 flex justify-center">
              <Sun size={32} />
            </div>
            <h3 className="text-white font-semibold mb-2">Real-time Updates</h3>
            <p className="text-white/80">Get instant weather information for any location worldwide</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
            <div className="text-yellow-300 mb-4 flex justify-center">
              <Cloud size={32} />
            </div>
            <h3 className="text-white font-semibold mb-2">5-Day Forecast</h3>
            <p className="text-white/80">Plan ahead with accurate 5-day weather predictions</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
            <div className="text-yellow-300 mb-4 flex justify-center">
              <Wind size={32} />
            </div>
            <h3 className="text-white font-semibold mb-2">Detailed Insights</h3>
            <p className="text-white/80">Access comprehensive weather data and statistics</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/60">
        <p>© 2025 WeatherApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;