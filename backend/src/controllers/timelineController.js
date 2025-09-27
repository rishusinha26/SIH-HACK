import Notification from '../models/Notification.js';

export async function listNotifications(req, res) {
  const { type, stream } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (stream) filter.stream = stream;
  const items = await Notification.find(filter).sort({ deadline: 1 }).limit(100);
  res.json({ items });
}



