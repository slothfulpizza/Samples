import React, { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from './types';
import { getWeatherByCity, getWeatherByCoords } from './services/weatherService';
import { getWeatherSummary } from './services/geminiService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import GeminiSummary from './components/GeminiSummary';
import HourlyForecast from './components/HourlyForecast';
import { Sun, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState<string>('London');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [geminiSummary, setGeminiSummary] = useState<string>('');
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);

  // State for background transitions
  const [backgroundClass, setBackgroundClass] = useState('from-slate-800 to-gray-900');
  const [oldBackgroundClass, setOldBackgroundClass] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const determineBackgroundClass = useCallback((data: WeatherData | null) => {
    if (!data) return 'from-slate-800 to-gray-900';
    const condition = data.current.condition.toLowerCase();
    if (condition.includes('clear') || condition.includes('sun')) return 'from-sky-500 to-indigo-500';
    if (condition.includes('cloud')) return 'from-slate-500 to-slate-700';
    if (condition.includes('rain') || condition.includes('drizzle')) return 'from-slate-700 to-gray-900';
    if (condition.includes('snow')) return 'from-sky-200 to-blue-400';
    if (condition.includes('thunder')) return 'from-indigo-800 to-gray-900';
    return 'from-slate-800 to-gray-900';
  }, []);

  useEffect(() => {
    const newClass = determineBackgroundClass(weatherData);
    if (newClass !== backgroundClass) {
      setOldBackgroundClass(backgroundClass);
      setBackgroundClass(newClass);
      const timer = setTimeout(() => {
        setOldBackgroundClass(null);
      }, 1000); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [weatherData, backgroundClass, determineBackgroundClass]);

  useEffect(() => {
    if (oldBackgroundClass) {
      // After oldBackgroundClass is set, we wait for the next frame to apply the fade-out class.
      // This ensures the transition is applied correctly.
      const frame = requestAnimationFrame(() => setIsFadingOut(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setIsFadingOut(false);
    }
  }, [oldBackgroundClass]);


  const fetchWeatherAndSummary = useCallback(async (location: { city?: string; lat?: number; lon?: number }) => {
    setIsLoading(true);
    setError(null);
    setGeminiSummary('');

    try {
      let data: WeatherData;
      if (location.city) {
        data = await getWeatherByCity(location.city);
        setCity(data.city);
      } else if (location.lat !== undefined && location.lon !== undefined) {
        data = await getWeatherByCoords(location.lat, location.lon);
        setCity(data.city);
      } else {
        throw new Error('No location specified');
      }
      setWeatherData(data);

      setIsGeminiLoading(true);
      try {
        const summary = await getWeatherSummary(data);
        setGeminiSummary(summary);
      } catch (geminiError) {
        console.error('Gemini API error:', geminiError);
        setGeminiSummary('Could not generate a weather summary at this time.');
      } finally {
        setIsGeminiLoading(false);
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (searchCity: string) => {
    fetchWeatherAndSummary({ city: searchCity });
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherAndSummary({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (err) => {
          setError(`Geolocation failed: ${err.message}`);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    fetchWeatherAndSummary({ city: 'London' });
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on initial mount
  
  return (
    <div className="min-h-screen w-full font-sans text-white">
      {/* Background Layers */}
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${backgroundClass}`}></div>
        {oldBackgroundClass && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${oldBackgroundClass} transition-opacity duration-1000 ease-in-out ${
              isFadingOut ? 'opacity-0' : 'opacity-100'
            }`}
          />
        )}
      </div>
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 tracking-wide text-shadow">
            Gemini Weather
          </h1>
          <p className="text-center text-lg text-slate-300">Your AI-powered weather forecast</p>
          <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocation} isLoading={isLoading} />
        </header>

        <main>
          {isLoading && !error && (
            <div className="flex flex-col items-center justify-center h-64">
              <Sun className="h-16 w-16 animate-spin text-yellow-300" />
              <p className="mt-4 text-xl">Fetching weather data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative text-center" role="alert">
              <AlertTriangle className="h-6 w-6 inline-block mr-2" />
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {!isLoading && weatherData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <CurrentWeather data={weatherData.current} city={city} />
                <GeminiSummary summary={geminiSummary} isLoading={isGeminiLoading} />
                <HourlyForecast data={weatherData.hourly} />
              </div>
              <div className="lg:col-span-3">
                <Forecast data={weatherData.forecast} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;