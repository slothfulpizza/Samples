import React from 'react';
import type { CurrentWeather as CurrentWeatherType } from '../types';
import WeatherIcon from './WeatherIcon';
import { Wind, Droplets, Thermometer, Eye } from 'lucide-react';

interface CurrentWeatherProps {
  data: CurrentWeatherType;
  city: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, city }) => {
  return (
    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-3xl font-bold">{city}</h2>
        <p className="text-7xl font-light tracking-tighter">{data.temperature}°C</p>
        <p className="text-xl text-white/80 capitalize">{data.condition}</p>
      </div>
      <div className="w-32 h-32 md:w-40 md:h-40">
        <WeatherIcon condition={data.condition} className="w-full h-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center w-full md:w-auto">
        <div className="flex flex-col items-center">
          <Thermometer className="h-6 w-6 text-white/80" />
          <p className="font-bold text-lg">{data.feelsLike}°C</p>
          <p className="text-sm text-white/70">Feels Like</p>
        </div>
        <div className="flex flex-col items-center">
          <Wind className="h-6 w-6 text-white/80" />
          <p className="font-bold text-lg">{data.windSpeed} km/h</p>
          <p className="text-sm text-white/70">Wind</p>
        </div>
        <div className="flex flex-col items-center">
          <Droplets className="h-6 w-6 text-white/80" />
          <p className="font-bold text-lg">{data.humidity}%</p>
          <p className="text-sm text-white/70">Humidity</p>
        </div>
        <div className="flex flex-col items-center">
          <Eye className="h-6 w-6 text-white/80" />
          <p className="font-bold text-lg">{data.visibility} km</p>
          <p className="text-sm text-white/70">Visibility</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;