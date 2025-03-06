import express from 'express';
import cors from 'cors';
import { redisClient } from './utils/redis';
import alertRoutes from './routes/alerts';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Caching middleware
app.use(async (req, res, next) => {
  if (req.method === 'GET') {
    const key = req.originalUrl;
    const cachedData = await redisClient.get(key);
    
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // Cache the response after sending
    const originalSend = res.send;
    res.send = (body) => {
      redisClient.setEx(key, 3600, JSON.stringify(body)); // Cache for 1 hour
      return originalSend.call(res, body);
    };
  }
  next();
});

// Routes
app.use('/api/alerts', alertRoutes);

export default app;