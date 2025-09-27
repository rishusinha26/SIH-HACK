import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import recommendRoutes from './routes/recommend.js';
import collegeRoutes from './routes/colleges.js';
import timelineRoutes from './routes/timeline.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/timeline', timelineRoutes);

const PORT = process.env.PORT || 5000;

connectDatabase(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`EduGuide API running on :${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });


