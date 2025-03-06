import { Router } from 'express';
import { redisClient } from '../utils/redis';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Your business logic here
    const alerts = await getAlertsFromDB(); 
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;