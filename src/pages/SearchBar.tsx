// src/components/SearchBar.tsx
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onCitySelect: (city: string) => void;
  initialCity?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect, initialCity = '' }) => {
  const [inputValue, setInputValue] = useState(initialCity);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Expanded list of cities from around the world for better suggestions
  const popularCities = [
    // Major world cities
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Moscow', 'Beijing',
    'Mumbai', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico City', 'Cairo', 'Los Angeles',
    'Bangkok', 'Buenos Aires', 'Istanbul', 'Karachi', 'Dhaka', 'Manila', 'Seoul',
  
    // US cities
    'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Seattle',
    'Denver', 'Boston', 'Atlanta', 'Miami', 'Las Vegas', 'Portland',
  
    // European cities
    'Madrid', 'Rome', 'Athens', 'Amsterdam', 'Brussels', 'Vienna', 'Stockholm',
    'Prague', 'Warsaw', 'Budapest', 'Barcelona', 'Dublin', 'Lisbon', 'Copenhagen',
    'Helsinki', 'Oslo', 'Zurich', 'Geneva', 'Munich', 'Frankfurt', 'Milan',
  
    // Asian cities
    'Singapore', 'Hong Kong', 'Dubai', 'Abu Dhabi', 'Taipei', 'Kuala Lumpur',
    'Jakarta', 'Ho Chi Minh City', 'Hanoi', 'Bangalore', 'Chennai', 'Kolkata',
    'Lahore', 'Riyadh', 'Jeddah', 'Baghdad', 'Tehran', 'Osaka', 'Kyoto', 'Yokohama',
  
    // Indian cities
    'Ahmedabad', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
    'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Ranchi', 'Jodhpur', 'Raipur', 'Guwahati', 'Chandigarh',
    'Amritsar', 'Allahabad', 'Coimbatore', 'Vijayawada', 'Madurai', 'Jabalpur',
    'Gwalior', 'Noida', 'Kochi', 'Hubli-Dharwad', 'Mysuru', 'Tiruchirappalli',
    'Bareilly', 'Aligarh', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem',
    'Warangal', 'Guntur', 'Bhiwandi', 'Cuttack', 'Firozabad', 'Kota', 'Kozhikode',
    'Durg', 'Bhilai', 'Bilaspur', 'Raigarh', 'Korba', 'Rourkela', 'Dhanbad', 'Asansol',
    'Ambikapur', 'Kolkata', 'Jammu', 'Srinagar', 'Nanded', 'Belgaum', 'Shimla', 'Dehradun',
    'Gaya', 'Rishikesh', 'Haridwar', 'Haldwani', 'Muzaffarpur', 'Kota', 'Agartala',
    'Jalgaon', 'Puducherry', 'Kannur', 'Siliguri', 'Vellore', 'Tirunelveli', 'Erode',
    'Madurai', 'Tirupati', 'Hosur', 'Mysore', 'Udaipur', 'Kochi', 'Bhubaneshwar',
    'Nagapattinam', 'Palakkad', 'Mangalore', 'Warangal', 'Jhansi', 'Rampur', 'Fatehpur',
  
    // Australian and NZ cities
    'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Auckland', 'Wellington',
  
    // African cities
    'Lagos', 'Johannesburg', 'Cape Town', 'Nairobi', 'Addis Ababa', 'Accra',
    'Casablanca', 'Algiers', 'Tunis', 'Khartoum', 'Dar es Salaam',
  
    // South American cities
    'Rio de Janeiro', 'Santiago', 'Lima', 'Bogotá', 'Caracas', 'Montevideo',
    'Quito', 'La Paz'
  ];
  

  // Use OpenWeatherMap's geocoding API for more accurate city suggestions
  const fetchCitySuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions(popularCities.slice(0, 15)); // Show top 15 popular cities when input is empty
      return;
    }

    setLoading(true);
    try {
      // First try to get cities directly from OpenWeatherMap's geocoding API
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=15&appid=0f2675fb7b8717c74162975068e074eb`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          // Format results to show city name and country
          const formattedCities = data.map((city: any) => {
            // Some cities don't have state info, handle that case
            const displayName = city.state 
              ? `${city.name}, ${city.state}, ${city.country}`
              : `${city.name}, ${city.country}`;
            return displayName;
          });
          setSuggestions(formattedCities);
        } else {
          // If no results from API, fallback to filtering popular cities
          fallbackToLocalSearch(query);
        }
      } else {
        fallbackToLocalSearch(query);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      fallbackToLocalSearch(query);
    } finally {
      setLoading(false);
    }
  };

  // Fallback to searching in our local array of cities
  const fallbackToLocalSearch = (query: string) => {
    const filteredCities = popularCities.filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredCities.slice(0, 15)); // Limit to 15 results
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Debounce API calls
    debounceFetch(value);
    
    // Show suggestions when typing
    setShowSuggestions(true);
  };

  // Simple debounce function
  const debounceFetch = (() => {
    let timeout: NodeJS.Timeout | null = null;
    return (value: string) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        fetchCitySuggestions(value);
      }, 300);
    };
  })();

  // Handle suggestion selection
  const handleSuggestionClick = (city: string) => {
    setInputValue(city);
    onCitySelect(city);
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCitySelect(inputValue);
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initial suggestions load
  useEffect(() => {
    // Show some popular cities on initial load
    setSuggestions(popularCities.slice(0, 15));
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 pl-10 rounded-l text-gray-800 border-2 border-r-0 border-blue-300 focus:outline-none focus:border-blue-500"
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 px-4 py-3 rounded-r text-white hover:bg-blue-600 transition-colors font-medium"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <ul className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <li className="px-4 py-3 text-gray-500 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading suggestions...
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(city)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {city}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500">No cities found. Try a different search.</li>
          )}
          
          {!loading && suggestions.length > 0 && (
            <li className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
              {inputValue.trim() === '' ? 
                'Popular cities worldwide' : 
                `Showing results for "${inputValue}"`}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;