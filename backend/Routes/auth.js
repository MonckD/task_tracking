import { Router } from 'express';
import { register, login, createAdmin, profile } from '../Controllers/authController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';
import { requireAdmin } from '../Middlewares/authorize.js';

const router = Router();

router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/auth/profile', authenticateToken, profile);
router.post('/api/auth/users', authenticateToken, requireAdmin, createAdmin);

export default router;