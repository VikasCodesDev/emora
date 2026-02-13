import express from 'express';
import {
  signup,
  login,
  logout,
  getMe,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate, signupSchema, loginSchema } from '../middleware/validation';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
