import Message from '../Models/Message.js';
import User from '../Models/User.js';
import TeamMember from '../Models/TeamMember.js';

async function getMessagesByTeam(req, res) {
  try {
    const team_id = req.params.teamId;

    const membership = await TeamMember.findOne({
      where: { user_id: req.user.id, team_id },
    });
    if (!membership) {
      return res.status(403).json({ message: 'Vous n\'êtes pas membre de cette équipe' });
    }

    const messages = await Message.findAll({
      where: { team_id },
      include: [{ model: User, as: 'sender', attributes: ['id', 'nom', 'email'] }],
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des messages', error: error.message });
  }
}

export { getMessagesByTeam };