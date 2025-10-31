import React from 'react';
import type { ForecastDay } from '../types';
import WeatherIcon from './WeatherIcon';

interface ForecastProps {
  data: ForecastDay[];
}

const ForecastCard: React.FC<{ day: ForecastDay }> = ({ day }) => {
  const date = new Date(day.date);
  // Account for timezone offset to prevent date shifting
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm text-center">
      <p className="font-semibold text-lg">{dayName}</p>
      <div className="w-16 h-16 my-2">
         <WeatherIcon condition={day.condition} className="w-full h-full" />
      </div>
      <div className="flex gap-2">
        <p className="font-bold">{day.maxTemp}°</p>
        <p className="text-slate-400">{day.minTemp}°</p>
      </div>
    </div>
  );
};


const Forecast: React.FC<ForecastProps> = ({ data }) => {
  return (
    <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg">
       <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {data.map((day) => (
                <ForecastCard key={day.date} day={day} />
            ))}
       </div>
    </div>
  );
};

export default Forecast;