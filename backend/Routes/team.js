import { Router } from 'express';
import { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam, addMember, removeMember } from '../Controllers/teamController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';
import { requireAdmin } from '../Middlewares/authorize.js';

const router = Router();

router.post('/api/teams', authenticateToken, requireAdmin, createTeam);
router.get('/api/teams', authenticateToken, getAllTeams);
router.get('/api/teams/:id', authenticateToken, getTeamById);
router.put('/api/teams/:id', authenticateToken, requireAdmin, updateTeam);
router.delete('/api/teams/:id', authenticateToken, requireAdmin, deleteTeam);
router.post('/api/teams/:id/members', authenticateToken, requireAdmin, addMember);
router.delete('/api/teams/:id/members/:memberId', authenticateToken, requireAdmin, removeMember);

export default router;