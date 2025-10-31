import type { WeatherData, ForecastDay, CurrentWeather, HourlyForecast } from '../types';

// This app now uses the OpenWeatherMap API for live data.
// An API key is required. Please set the WEATHER_API_KEY environment variable.
const API_KEY = typeof process !== 'undefined' && process.env && process.env.WEATHER_API_KEY
  ? process.env.WEATHER_API_KEY
  : '';
  
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// --- Data Transformation ---

/**
 * Transforms raw data from the OpenWeatherMap API into the WeatherData structure used by the app.
 * @param currentData - Raw response from the /weather endpoint.
 * @param forecastData - Raw response from the /forecast endpoint.
 * @returns A structured WeatherData object.
 */
const transformWeatherData = (currentData: any, forecastData: any): WeatherData => {
    // Current Weather
    const current: CurrentWeather = {
        temperature: Math.round(currentData.main.temp - 273.15),
        condition: currentData.weather[0].main,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        humidity: currentData.main.humidity,
        feelsLike: Math.round(currentData.main.feels_like - 273.15),
        visibility: Math.round(currentData.visibility / 1000), // Convert meters to km
    };

    // Hourly Forecast (next 24 hours, in 3-hour intervals)
    const hourly: HourlyForecast[] = forecastData.list.slice(0, 8).map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', ''),
            temperature: Math.round(item.main.temp - 273.15),
            condition: item.weather[0].main,
            precipitationChance: Math.round(item.pop * 100),
        };
    });
    
    // 5-Day Forecast
    const dailyForecasts: { [key: string]: any[] } = {};
    forecastData.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });

    const forecastDaysProcessed: ForecastDay[] = Object.keys(dailyForecasts).map(date => {
        const dayItems = dailyForecasts[date];
        const minTemp = Math.min(...dayItems.map(item => item.main.temp_min));
        const maxTemp = Math.max(...dayItems.map(item => item.main.temp_max));
        const representativeItem = dayItems.find(item => item.dt_txt.includes("12:00:00")) || dayItems[0];
        
        return {
            date: date,
            maxTemp: Math.round(maxTemp - 273.15),
            minTemp: Math.round(minTemp - 273.15),
            condition: representativeItem.weather[0].main,
        };
    });

    // Ensure we return the *next* 5 days, excluding today.
    const todayStr = new Date().toISOString().split('T')[0];
    const todayIndex = forecastDaysProcessed.findIndex(day => day.date === todayStr);
    const forecast = todayIndex !== -1 
        ? forecastDaysProcessed.slice(todayIndex + 1, todayIndex + 6) 
        : forecastDaysProcessed.slice(0, 5);


    return {
        city: currentData.name,
        current,
        hourly,
        forecast,
    };
};


// --- API Fetching ---

/**
 * Generic fetch handler for API calls.
 * @param url - The URL to fetch.
 * @returns The JSON response.
 */
const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    return response.json();
}

/**
 * Fetches weather data for a given city name.
 * @param city - The name of the city.
 * @returns A promise that resolves to the structured WeatherData.
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    if (!city || city.trim() === '') {
        throw new Error(`Please enter a valid city name.`);
    }
    if (!API_KEY) {
      throw new Error('Weather API key (WEATHER_API_KEY) is not configured.');
    }

    const currentUrl = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}`;
    const forecastUrl = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}`;

    try {
        const [currentData, forecastData] = await Promise.all([
            fetchData(currentUrl),
            fetchData(forecastUrl)
        ]);
        return transformWeatherData(currentData, forecastData);
    } catch(error) {
        console.error("Failed to fetch weather data for city:", error);
        if (error instanceof Error && error.message.toLowerCase().includes('city not found')) {
            throw new Error(`Could not find weather data for "${city}". Please check the spelling.`);
        }
        throw new Error('Failed to retrieve weather data. Please try again.');
    }
};

/**
 * Fetches weather data for given geographic coordinates.
 * @param lat - Latitude.
 * @param lon - Longitude.
 * @returns A promise that resolves to the structured WeatherData.
 */
export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    if (!API_KEY) {
      throw new Error('Weather API key (WEATHER_API_KEY) is not configured.');
    }
    
    const currentUrl = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const forecastUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    try {
        const [currentData, forecastData] = await Promise.all([
            fetchData(currentUrl),
            fetchData(forecastUrl)
        ]);
        return transformWeatherData(currentData, forecastData);
    } catch(error) {
        console.error("Failed to fetch weather data by coordinates:", error);
        throw new Error('Could not fetch weather data for your current location.');
    }
};