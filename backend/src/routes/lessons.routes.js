import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  const lessons = db.prepare(
    'SELECT id, title, description, difficulty, order_num FROM lessons ORDER BY order_num'
  ).all();

  const progress = db.prepare(
    'SELECT lesson_id, completed, score FROM user_progress WHERE user_id = ?'
  ).all(req.user.id);

  const progressMap = {};
  for (const p of progress) {
    progressMap[p.lesson_id] = p;
  }

  const lessonsWithProgress = lessons.map(l => ({
    ...l,
    completed: progressMap[l.id]?.completed === 1,
    score: progressMap[l.id]?.score || 0
  }));

  res.json(lessonsWithProgress);
});

router.get('/:id', authenticateToken, (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Lição não encontrada' });
  }

  const exercises = db.prepare(
    'SELECT id, question, options, explanation FROM exercises WHERE lesson_id = ? ORDER BY id'
  ).all(req.params.id);

  const parsedExercises = exercises.map(e => ({
    ...e,
    options: JSON.parse(e.options)
  }));

  const progress = db.prepare(
    'SELECT completed, score FROM user_progress WHERE user_id = ? AND lesson_id = ?'
  ).get(req.user.id, req.params.id);

  res.json({
    ...lesson,
    exercises: parsedExercises,
    progress: progress || { completed: false, score: 0 }
  });
});

router.post('/:id/complete', authenticateToken, (req, res) => {
  const { answers } = req.body;
  const lessonId = req.params.id;

  const exercises = db.prepare(
    'SELECT id, correct_answer FROM exercises WHERE lesson_id = ?'
  ).all(lessonId);

  if (!exercises.length) {
    return res.status(404).json({ error: 'Exercícios não encontrados' });
  }

  let correct = 0;
  const results = exercises.map((ex, i) => {
    const isCorrect = answers[i] === ex.correct_answer;
    if (isCorrect) correct++;
    return { exerciseId: ex.id, correct: isCorrect };
  });

  const score = Math.round((correct / exercises.length) * 100);
  const points = correct * 10;

  db.prepare(`
    INSERT INTO user_progress (user_id, lesson_id, completed, score, completed_at)
    VALUES (?, ?, 1, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, lesson_id) DO UPDATE SET
      completed = 1, score = MAX(score, excluded.score), completed_at = CURRENT_TIMESTAMP
  `).run(req.user.id, lessonId, score);

  db.prepare(`
    INSERT INTO user_stats (user_id, total_points, total_exercises, total_correct)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      total_points = total_points + excluded.total_points,
      total_exercises = total_exercises + excluded.total_exercises,
      total_correct = total_correct + excluded.total_correct
  `).run(req.user.id, points, exercises.length, correct);

  res.json({ score, correct, total: exercises.length, points, results });
});

export default router;
