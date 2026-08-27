import { Router } from 'express';
import { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam, addMember, removeMember } from '../Controllers/teamController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';
import authorize from '../Middlewares/authorize.js';

const router = Router();

router.post('/api/teams', authenticateToken, authorize('admin'), createTeam);
router.get('/api/teams', authenticateToken, getAllTeams);
router.get('/api/teams/:id', authenticateToken, getTeamById);
router.put('/api/teams/:id', authenticateToken, authorize('admin'), updateTeam);
router.delete('/api/teams/:id', authenticateToken, authorize('admin'), deleteTeam);
router.post('/api/teams/:id/members', authenticateToken, authorize('admin'), addMember);
router.delete('/api/teams/:id/members/:memberId', authenticateToken, authorize('admin'), removeMember);

export default router;