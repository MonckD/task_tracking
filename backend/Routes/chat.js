import { Router } from 'express';
import { getMessagesByTeam } from '../Controllers/chatController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';

const router = Router();

router.get('/api/teams/:teamId/messages', authenticateToken, getMessagesByTeam);

export default router;