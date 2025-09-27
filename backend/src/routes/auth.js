import { Router } from 'express';
import { register, login, me, updateMe, forgotPassword, verifyOtp, resetPassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateMe);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;


