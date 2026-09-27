import { getCachedData, setCachedData } from '../cache/redis';
import { fetchWeatherData } from '../services/weather';

export const getWeather = async (req: Request, res: Response) => {
  // Extract params, defaulting to "today" if not provided
  const location = req.query.location as string;
  const date1 = (req.query.date1 as string) || 'today';
  const date2 = (req.query.date2 as string) || 'today';

  if (!location) {
    return res.status(400).json({ error: 'Location query parameter is required' });
  }

  // Create a unique cache key that includes the dates
  const cacheKey = `weather:${location.toLowerCase()}:${date1}:${date2}`;

  try {
    // 1. Check Cache
    const cachedWeather = await getCachedData(cacheKey);
    if (cachedWeather) {
      console.log('✅ Serving from Redis Cache');
      return res.json({ source: 'cache', data: cachedWeather });
    }

    // 2. Cache Miss: Fetch from External API
    console.log('🌐 Fetching from Visual Crossing API');
    const freshWeather = await fetchWeatherData(location, date1, date2);

    // 3. Save to Cache (TTL: 600 seconds = 10 minutes)
    await setCachedData(cacheKey, freshWeather, 600);

    // 4. Return to user
    res.json({ source: 'api', data: freshWeather });

  } catch (error) {
    console.error('Controller Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data. Please check your location and dates.' });
  }
};
