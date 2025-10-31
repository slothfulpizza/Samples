import type { WeatherData, ForecastDay, CurrentWeather, HourlyForecast } from '../types';

// --- Mock Data Generation ---

const MOCK_CONDITIONS = ['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'];

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateMockWeatherData = (city: string): WeatherData => {
  // Base condition and temperature for consistency
  const baseCondition = getRandomElement(MOCK_CONDITIONS);
  let baseTemp: number;

  // Make temperature somewhat realistic for the condition
  switch (baseCondition) {
    case 'Clear': baseTemp = getRandomInt(15, 30); break;
    case 'Clouds': baseTemp = getRandomInt(10, 22); break;
    case 'Rain': case 'Drizzle': baseTemp = getRandomInt(8, 18); break;
    case 'Snow': baseTemp = getRandomInt(-5, 2); break;
    case 'Thunderstorm': baseTemp = getRandomInt(18, 28); break;
    case 'Mist': baseTemp = getRandomInt(5, 15); break;
    default: baseTemp = getRandomInt(5, 25);
  }

  // Current Weather
  const current: CurrentWeather = {
    temperature: baseTemp,
    condition: baseCondition,
    windSpeed: getRandomInt(5, 40),
    humidity: getRandomInt(40, 90),
    feelsLike: baseTemp - getRandomInt(1, 5),
    visibility: getRandomInt(1, 10),
  };

  // Hourly Forecast (next 12 hours)
  const hourly: HourlyForecast[] = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setHours(date.getHours() + i + 1);
    const tempFluctuation = getRandomInt(-2, 2);
    const chanceOfPrecip = ['Rain', 'Drizzle', 'Snow', 'Thunderstorm'].includes(baseCondition)
      ? getRandomInt(40, 90)
      : getRandomInt(0, 20);

    return {
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(' ', ''),
      temperature: baseTemp + tempFluctuation,
      condition: baseCondition, // Keep it simple, same condition
      precipitationChance: chanceOfPrecip,
    };
  });

  // 5-Day Forecast
  const forecast: ForecastDay[] = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    const dayCondition = getRandomElement(MOCK_CONDITIONS);
    const minTemp = baseTemp + getRandomInt(-8, -2);
    const maxTemp = baseTemp + getRandomInt(2, 8);

    return {
      date: date.toISOString().split('T')[0],
      maxTemp: Math.max(minTemp, maxTemp),
      minTemp: Math.min(minTemp, maxTemp),
      condition: dayCondition,
    };
  });

  return {
    city,
    current,
    hourly,
    forecast,
  };
};

// --- Mock Service Implementation ---

const simulateApiCall = <T>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), 500 + Math.random() * 500));
}

/**
 * Fetches mock weather data for a given city name.
 * @param city - The name of the city.
 * @returns A promise that resolves to the structured WeatherData.
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    if (!city || city.trim() === '') {
        throw new Error(`Please enter a valid city name.`);
    }

    if (city.toLowerCase() === 'nowhere') {
      throw new Error(`Could not find weather data for "${city}". It probably doesn't exist!`);
    }

    const mockData = generateMockWeatherData(city);
    return simulateApiCall(mockData);
};

/**
 * Fetches mock weather data for given geographic coordinates.
 * @param lat - Latitude (unused in mock).
 * @param lon - Longitude (unused in mock).
 * @returns A promise that resolves to the structured WeatherData.
 */
export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    // We don't use lat/lon, just return data for a generic "Current Location"
    const mockData = generateMockWeatherData('Current Location');
    return simulateApiCall(mockData);
};