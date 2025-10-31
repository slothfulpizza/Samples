import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocate: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGeolocate, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-lg mx-auto">
      <div className="relative flex-grow w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400/80 placeholder-white/60 backdrop-blur-sm"
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 rounded-full font-semibold transition-colors flex-grow"
          disabled={isLoading}
        >
          Search
        </button>
        <button
          type="button"
          onClick={onGeolocate}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 rounded-full transition-colors"
          disabled={isLoading}
          aria-label="Use my location"
        >
          <MapPin className="h-6 w-6 text-white" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;