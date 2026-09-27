import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller'; 

const router = Router();

/**
 * @route   GET /api/weather
 * @desc    Get weather data for a location and date range (with Redis caching)
 * @query   location (string, required), date1 (string, optional), date2 (string, optional)
 */
router.get('/', getWeather);

export default router;
