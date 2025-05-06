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

  // Popular cities to suggest initially or when input is empty
  const popularCities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 
    'Berlin', 'Moscow', 'Mumbai', 'Delhi', 'Beijing'
  ];

  const fetchCitySuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions(popularCities);
      return;
    }

    setLoading(true);
    try {
      // Using the GeoDB Cities API for city suggestions
      const response = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=10`,
        {
          headers: {
            'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual API key
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          }
        }
      );
      
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setSuggestions(data.data.map((city: any) => city.name));
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      // Fallback to a filtered list of popular cities
      setSuggestions(
        popularCities.filter(city => 
          city.toLowerCase().includes(query.toLowerCase())
        )
      );
    } finally {
      setLoading(false);
    }
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
    fetchCitySuggestions('');
  }, []);

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 rounded-l text-black border-2 border-r-0 border-blue-300 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 px-4 py-2 rounded-r text-white hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <ul className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <li className="px-4 py-2 text-gray-500">Loading suggestions...</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(city)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-800"
              >
                {city}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No cities found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;