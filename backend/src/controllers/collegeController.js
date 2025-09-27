import College from '../models/College.js';

export async function listColleges(req, res) {
  const { state, city, stream, q } = req.query;
  const filter = {};
  if (state) filter.state = state;
  if (city) filter.city = city;
  if (stream) filter.streams = { $in: [stream] };
  if (q) filter.name = { $regex: q, $options: 'i' };
  const colleges = await College.find(filter).limit(100);
  res.json({ colleges });
}



