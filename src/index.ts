import express from 'express';
import dotenv from 'dotenv';
import { connectRedis } from './config/db';
import weatherRoutes from './routes/weather';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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
