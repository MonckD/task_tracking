import { Router } from 'express';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../Controllers/projectController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';
import authorize from '../Middlewares/authorize.js';

const router = Router();

router.post('/api/projects', authenticateToken, authorize('admin', 'chef_projet'), createProject);
router.get('/api/projects', authenticateToken, getAllProjects);
router.get('/api/projects/:id', authenticateToken, getProjectById);
router.put('/api/projects/:id', authenticateToken, authorize('admin', 'chef_projet'), updateProject);
router.delete('/api/projects/:id', authenticateToken, authorize('admin'), deleteProject);

export default router;