import { Router } from 'express';
import { listColleges } from '../controllers/collegeController.js';

const router = Router();

router.get('/', listColleges);

export default router;



