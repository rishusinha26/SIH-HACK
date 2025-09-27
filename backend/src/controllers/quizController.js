import QuizResult from '../models/QuizResult.js';
import User from '../models/User.js';
import { mapScoresToStreams } from '../utils/recommendation.js';

export async function submitQuiz(req, res) {
  try {
    const { scores, recommendedStreams, answers } = req.body;
    if (!scores) return res.status(400).json({ message: 'Scores required' });
    
    const finalRecommendedStreams = recommendedStreams || mapScoresToStreams(scores);
    const result = await QuizResult.create({ 
      user: req.user.id, 
      scores, 
      recommendedStreams: finalRecommendedStreams,
      answersCount: answers || 0,
      submittedAt: new Date()
    });
    
    await User.findByIdAndUpdate(req.user.id, { 
      $set: { 'recommendations.streams': finalRecommendedStreams } 
    });
    
    res.json({ result });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
}

export async function getMyQuiz(req, res) {
  const result = await QuizResult.findOne({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ result });
}



