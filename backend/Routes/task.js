import { Router } from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, markAsDone, addTaskUpdate } from '../Controllers/taskController.js';
import { authenticateToken } from '../Middlewares/verifyJWT.js';

const router = Router();

router.get('/api/tasks', authenticateToken, getAllTasks);
router.get('/api/tasks/:id', authenticateToken, getTaskById);
router.post('/api/tasks', authenticateToken, createTask);
router.put('/api/tasks/:id', authenticateToken, updateTask);
router.delete('/api/tasks/:id', authenticateToken, deleteTask);
router.patch('/api/tasks/:id/done', authenticateToken, markAsDone);
router.post('/api/tasks/:id/updates', authenticateToken, addTaskUpdate);

export default router;