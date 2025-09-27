import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import { mapScoresToStreams } from '../utils/recommendation.js';

export async function submitQuiz(req, res) {
  const { scores } = req.body;
  if (!scores) return res.status(400).json({ message: 'Scores required' });
  const recommendedStreams = mapScoresToStreams(scores);
  const result = await QuizResult.create({ user: req.user.id, scores, recommendedStreams });
  await User.findByIdAndUpdate(req.user.id, { $set: { 'recommendations.streams': recommendedStreams } });
  res.json({ result });
}

export async function getMyQuiz(req, res) {
  const result = await QuizResult.findOne({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ result });
}



