import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getRecommendations } from '../controllers/recommendController.js';

const router = Router();

router.get('/', requireAuth, getRecommendations);

export default router;



