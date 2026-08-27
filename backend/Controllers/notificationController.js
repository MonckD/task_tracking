import Notification from '../Models/Notification.js';
import TeamMember from '../Models/TeamMember.js';

async function getNotifications(req, res) {
  try {
    const memberships = await TeamMember.findAll({ where: { user_id: req.user.id } });
    const teamIds = memberships.map((m) => m.team_id);

    const notifications = await Notification.findAll({
      where: { team_id: teamIds },
      order: [['createdAt', 'DESC']],
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error: error.message });
  }
}

async function markAsRead(req, res) {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.update({ lu: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: error.message });
  }
}

export { getNotifications, markAsRead };