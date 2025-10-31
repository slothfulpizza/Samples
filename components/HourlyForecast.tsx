import React from 'react';
import type { HourlyForecast as HourlyForecastType } from '../types';
import WeatherIcon from './WeatherIcon';
import { Droplet } from 'lucide-react';

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

const HourlyCard: React.FC<{ hour: HourlyForecastType }> = ({ hour }) => {
  return (
    <div className="flex flex-col items-center justify-between gap-2 p-3 bg-white/5 rounded-xl min-w-[80px] text-center h-full">
      <p className="font-medium text-sm">{hour.time}</p>
      <div className="w-10 h-10">
        <WeatherIcon condition={hour.condition} className="w-full h-full" />
      </div>
      <p className="font-bold text-lg">{hour.temperature}°</p>
      <div className="flex items-center gap-1 text-xs text-blue-300/80">
        <Droplet className="w-3 h-3" />
        <span>{hour.precipitationChance}%</span>
      </div>
    </div>
  );
};

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  return (
    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
      <h3 className="text-xl font-bold mb-4">Hourly Forecast</h3>
      <div className="flex overflow-x-auto gap-4 pb-2 -mb-2">
        {data.map((hour, index) => (
          <HourlyCard key={`${hour.time}-${index}`} hour={hour} />
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
