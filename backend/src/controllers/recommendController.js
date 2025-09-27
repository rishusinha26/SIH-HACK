import Career from '../models/Career.js';
import College from '../models/College.js';
import QuizResult from '../models/QuizResult.js';

export async function getRecommendations(req, res) {
  const quiz = await QuizResult.findOne({ user: req.user.id }).sort({ createdAt: -1 });
  const streams = quiz?.recommendedStreams || [];

  const careers = await Career.find({ stream: { $in: streams } }).limit(20);

  const userCity = req.query.city;
  const collegesQuery = streams.length ? { streams: { $in: streams } } : {};
  let colleges = await College.find(collegesQuery).limit(20);
  if (userCity) {
    colleges = colleges.sort((a, b) => (a.city === userCity ? -1 : 1));
  }
  res.json({ streams, careers, colleges });
}



