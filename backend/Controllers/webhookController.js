import Notification from '../Models/Notification.js';
import User from '../Models/User.js';
import Project from '../Models/Project.js';
import { getIO } from '../Config/socket.js';

async function handleGitlabPush(req, res) {
  try {
    const payload = req.body;

    const userName = payload.user_name || 'unknown';
    const branch = payload.ref ? payload.ref.replace('refs/heads/', '') : 'unknown';
    const projectUrl = payload.project ? payload.project.web_url : '';
    const pushUrl = `${projectUrl}/-/tree/${branch}`;
    const projectName = payload.project ? payload.project.name : '';

    const contenu = `${userName} a poussé sur la branche ${branch}\n${pushUrl}`;

    const user = await User.findOne({ where: { email: payload.user_email } });

    const project = projectName ? await Project.findOne({ where: { nom: projectName } }) : null;

    const notification = await Notification.create({
      type: 'gitlab_push',
      contenu,
      team_id: project ? project.team_id : null,
      user_id: user ? user.id : null,
    });

    const io = getIO();
    if (io) {
      io.emit('receive_notification', notification);
    }

    res.status(201).json({ message: 'Webhook reçu', notification });
  } catch (error) {
    res.status(500).json({ message: 'Erreur webhook', error: error.message });
  }
}

export { handleGitlabPush };