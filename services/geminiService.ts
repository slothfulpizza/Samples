import { GoogleGenAI } from "@google/genai";
import type { WeatherData } from '../types';

// IMPORTANT: This check is to prevent crashing in environments where process.env is not defined.
const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY
  ? process.env.API_KEY
  : '';

if (!apiKey) {
  console.warn("API_KEY environment variable not found. Using a mock response for Gemini service.");
}

const ai = new GoogleGenAI({ apiKey });

export const getWeatherSummary = async (weatherData: WeatherData): Promise<string> => {
  if (!apiKey) {
    // Return a mock summary if the API key is not available
    return new Promise(resolve => setTimeout(() => resolve(`It's a pleasant day in ${weatherData.city}. The current temperature is ${weatherData.current.temperature}°C, feeling like ${weatherData.current.feelsLike}°C. Expect ${weatherData.current.condition.toLowerCase()} skies. The forecast shows similar conditions for the next few days.`), 500));
  }
  
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are a friendly and enthusiastic weather assistant.
    Based on the following JSON weather data, provide a short, conversational, and helpful summary of the weather.
    - Start by mentioning the city name.
    - Describe the current conditions, including temperature and what it feels like.
    - Briefly touch on the general forecast for the next few days.
    - Keep the tone light and engaging.
    - The summary should be a single paragraph of no more than 3-4 sentences.

    Weather Data:
    ${JSON.stringify(weatherData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to generate weather summary.");
  }
};
