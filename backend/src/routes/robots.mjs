import express from 'express';
import pool from '../db/client.mjs';
import { authorize } from '../middleware/auth.mjs';
import simulate from '../services/simulate.mjs';
import redisClient from '../redis/redisClient.mjs';

const router = express.Router();

router.get('/', authorize, async (req, res) => {
  try {
    const cached = await redisClient.get('robots');
    if(cached)
      return res.json(JSON.parse(cached));

    const result = await pool.query(`SELECT * FROM robots`);
    const robots = result.rows;
    const cachedTime = 10;

    await redisClient.setEx('robots', cachedTime, JSON.stringify(robots));

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/move', authorize, async (req, res) => {
  const robotId = req.params.id;

  try {
    const updated = await simulate(robotId);
    if(!updated)
      return res.status(404).json({ error: 'Robot not found' });

    await redisClient.del('robots');
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
