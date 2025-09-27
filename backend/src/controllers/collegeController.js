import College from '../models/College.js';

export async function listColleges(req, res) {
  try {
    const { state, city, stream, streams, q, maxFee, hostel } = req.query;
    const filter = {};
    
    if (state) filter.state = state;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (stream) filter.streams = { $in: [stream] };
    if (streams) {
      const streamArray = streams.split(',').map(s => s.trim());
      filter.streams = { $in: streamArray };
    }
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (maxFee) {
      filter['fees.annual'] = { $lte: parseInt(maxFee) };
    }
    if (hostel === 'true') {
      filter['hostel.available'] = true;
    }
    
    const colleges = await College.find(filter).sort({ 'fees.annual': 1 }).limit(100);
    res.json({ colleges });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Failed to fetch colleges' });
  }
}



