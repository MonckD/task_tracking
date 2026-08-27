import { Router } from 'express';
import { getNotifications, markAsRead } from '../Controllers/notificationController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';

const router = Router();

router.get('/api/notifications', authenticateToken, getNotifications);
router.patch('/api/notifications/:id/read', authenticateToken, markAsRead);

export default router;