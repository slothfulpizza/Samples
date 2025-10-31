import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Zap, CloudSun, CloudFog } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className }) => {
  const lowerCaseCondition = condition.toLowerCase();

  if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
    return <Sun className={`text-yellow-400 ${className}`} />;
  }
  if (lowerCaseCondition.includes('cloud') && (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('partly'))) {
     return <CloudSun className={`text-gray-300 ${className}`} />;
  }
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
    return <CloudRain className={`text-blue-300 ${className}`} />;
  }
  if (lowerCaseCondition.includes('snow') || lowerCaseCondition.includes('sleet')) {
    return <CloudSnow className={`text-white ${className}`} />;
  }
  if (lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm')) {
    return <Zap className={`text-yellow-300 ${className}`} />;
  }
   if (lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('haze')) {
    return <CloudFog className={`text-gray-400 ${className}`} />;
  }
  if (lowerCaseCondition.includes('cloud')) {
    return <Cloud className={`text-gray-300 ${className}`} />;
  }

  return <Sun className={`text-yellow-400 ${className}`} />; // Default icon
};

export default WeatherIcon;
