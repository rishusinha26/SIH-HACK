import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { submitQuiz, getMyQuiz } from '../controllers/quizController.js';

const router = Router();

router.post('/submit', requireAuth, submitQuiz);
router.get('/mine', requireAuth, getMyQuiz);

export default router;



