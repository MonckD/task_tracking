import { Router } from 'express';
import { register, login, profile } from '../Controllers/authController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';
import authorize from '../Middlewares/authorize.js';

const router = Router();

router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/auth/profile', authenticateToken, profile);
router.get('/api/auth/admin-only', authenticateToken, authorize('admin'), (req, res) => {
  res.json({ message: 'Bienvenue admin' });
});

export default router;