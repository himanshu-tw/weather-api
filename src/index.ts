import express from 'express';
import dotenv from 'dotenv';
import { connectRedis } from './config/db';
import weatherRoutes from './routes/weather';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define the rate limiting rule
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes in milliseconds
  max: 100, // Limit each IP to 100 requests per `window`
  message: {
    status: 429,
    error: "Too Many Requests",
    message: "You have exceeded the rate limit. Please try again later."
  },
  standardHeaders: true, // Return standard rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the old `X-RateLimit-*` headers
});

// Middleware
app.use(express.json());
app.use(limiter);

// Routes
// This means any request to /api/weather will be handled by weatherRoutes
app.use('/api/weather', weatherRoutes);

const startServer = async () => {
  try {
    // Connect to Redis first
    await connectRedis();

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`🌤️  Try it: http://localhost:${PORT}/api/weather?location=London&date1=today&date2=today`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
