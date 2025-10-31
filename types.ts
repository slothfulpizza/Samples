export interface CurrentWeather {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  feelsLike: number;
  visibility: number;
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitationChance: number;
}

export interface WeatherData {
  city: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  hourly: HourlyForecast[];
}