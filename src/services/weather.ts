import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// A basic TypeScript interface for the response. 
// You can expand this later with the exact fields you need (e.g., temp, humidity).
export interface WeatherResponse {
  resolvedAddress: string;
  address: string;
  days?: any[]; 
  currentConditions?: any;
  [key: string]: any; // Allows other dynamic properties from the API
}

/**
 * Fetches weather data from Visual Crossing API
 * @param location - The city or location (e.g., "London" or "New York")
 * @param date1 - The start date (e.g., "2023-10-01" or "today")
 * @param date2 - The end date (e.g., "2023-10-07" or "today")
 * @returns Promise resolving to the weather data
 */
export const fetchWeatherData = async (
  location: string,
  date1: string,
  date2: string
): Promise<WeatherResponse> => {
  const apiKey = process.env.WEATHER_API;

  // 1. Validate that the API key exists
  if (!apiKey) {
    throw new Error('WEATHER_API is not defined in .env file');
  }

  // 2. Encode the location to handle spaces and special characters 
  // (e.g., "New York" becomes "New%20York", preventing URL breaks)
  const encodedLocation = encodeURIComponent(location);

  // 3. Construct the URL. Added &contentType=json to guarantee a JSON response
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedLocation}/${date1}/${date2}?key=${apiKey}&contentType=json`;

  try {
    // 4. Make the request using native Node.js fetch (Node 18+)
    const response = await fetch(url);

    // 5. Handle HTTP errors (e.g., 401 Unauthorized, 404 Not Found)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // 6. Parse and return the JSON data
    const data: WeatherResponse = await response.json();
    return data;

  } catch (error) {
    console.error(`[Weather Service Error] Failed to fetch data for "${location}":`, error);
    // Re-throw the error so the controller can catch it and return a 500 response
    throw error; 
  }
};
