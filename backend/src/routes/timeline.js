import { Router } from 'express';
import { listNotifications } from '../controllers/timelineController.js';

const router = Router();

router.get('/', listNotifications);

export default router;



