import Team from '../Models/Team.js';
import TeamMember from '../Models/TeamMember.js';
import User from '../Models/User.js';

async function createTeam(req, res) {
    try {
        const { nom, description } = req.body;
        const team = await Team.create({ nom, description });

        await TeamMember.create({
            user_id: req.user.id,
            team_id: team.id,
            role_dans_equipe: 'chef_projet',
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'équipe', error: error.message });
    }
}

async function getAllTeams(req, res) {
    try {
        if (req.user.is_admin === true) {
            const teams = await Team.findAll({
                include: [{ model: User, as: 'members', attributes: ['id', 'nom', 'email', 'role'] }],
            });
            return res.json(teams);
        }

        const memberships = await TeamMember.findAll({ where: { user_id: req.user.id } });
        const teamIds = memberships.map((m) => m.team_id);

        const teams = await Team.findAll({
            where: { id: teamIds },
            include: [{ model: User, as: 'members', attributes: ['id', 'nom', 'email', 'role'] }],
        });

        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des équipes', error: error.message });
    }
}

async function getTeamById(req, res) {
    try {
        const team = await Team.findByPk(req.params.id, {
            include: [{ model: User, as: 'members', attributes: ['id', 'nom', 'email', 'role'] }],
        });
        if (!team) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'équipe', error: error.message });
    }
}

async function updateTeam(req, res) {
    try {
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }
        await team.update(req.body);
        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'équipe', error: error.message });
    }
}

async function deleteTeam(req, res) {
    try {
        const team = await Team.findByPk(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }
        await TeamMember.destroy({ where: { team_id: team.id } });
        await team.destroy();
        res.json({ message: 'Équipe supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'équipe', error: error.message });
    }
}

async function addMember(req, res) {
    try {
        const { user_id, role_dans_equipe } = req.body;
        const team_id = req.params.id;

        const existing = await TeamMember.findOne({ where: { user_id, team_id }, paranoid: false });
        if (existing) {
            return res.status(400).json({ message: 'Cet utilisateur est déjà dans l\'équipe' });
        }

        const member = await TeamMember.create({ user_id, team_id, role_dans_equipe });

        if (role_dans_equipe === 'chef_projet') {
            await User.update({ role: 'chef_projet' }, { where: { id: user_id } });
        }

        res.status(201).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du membre', error: error.message });
    }
}

async function removeMember(req, res) {
    try {
        const { id: team_id, memberId } = req.params;
        const member = await TeamMember.findOne({ where: { user_id: memberId, team_id } });
        if (!member) {
            return res.status(404).json({ message: 'Membre non trouvé dans cette équipe' });
        }
        await member.destroy();
        res.json({ message: 'Membre retiré de l\'équipe' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du retrait du membre', error: error.message });
    }
}

export { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam, addMember, removeMember };