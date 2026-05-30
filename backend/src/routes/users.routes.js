import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, (req, res) => {
  const stats = db.prepare(
    'SELECT total_points, total_exercises, total_correct, streak FROM user_stats WHERE user_id = ?'
  ).get(req.user.id);

  const completedLessons = db.prepare(
    'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1'
  ).get(req.user.id);

  const accuracy = stats?.total_exercises > 0
    ? Math.round((stats.total_correct / stats.total_exercises) * 100)
    : 0;

  res.json({
    total_points: stats?.total_points || 0,
    total_exercises: stats?.total_exercises || 0,
    total_correct: stats?.total_correct || 0,
    streak: stats?.streak || 0,
    completed_lessons: completedLessons?.count || 0,
    accuracy
  });
});

export default router;
