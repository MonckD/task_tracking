import { Router } from 'express';
import { handleGitlabPush } from '../Controllers/webhookController.js';

const router = Router();

router.post('/api/webhooks/gitlab', handleGitlabPush);

export default router;