import Task from '../Models/Task.js';
import TaskUpdate from '../Models/TaskUpdate.js';
import User from '../Models/User.js';
import Project from '../Models/Project.js';
import Team from '../Models/Team.js';
import TeamMember from '../Models/TeamMember.js';

async function createTask(req, res) {
    try {
        const { titre, description, statut, priorite, assigned_to, project_id } = req.body;

        const project = await Project.findByPk(project_id);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        if (req.user.role === 'chef_projet') {
            const membership = await TeamMember.findOne({
                where: { user_id: req.user.id, team_id: project.team_id },
            });
            if (!membership) {
                return res.status(403).json({ message: 'Vous n\'êtes pas membre de l\'équipe de ce projet' });
            }
        }

        const task = await Task.create({
            titre,
            description,
            statut,
            priorite,
            assigned_to,
            project_id,
            created_by: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la tâche', error: error.message });
    }
}

async function getAllTasks(req, res) {
    try {
        let where = {};

        if (req.user.role === 'admin') {
            const tasks = await Task.findAll({
                include: [
                    { model: User, as: 'assignee', attributes: ['id', 'nom', 'email'] },
                    { model: User, as: 'creator', attributes: ['id', 'nom', 'email'] },
                    { model: Project, attributes: ['id', 'nom'] },
                ],
            });
            return res.json(tasks);
        }

        const memberships = await TeamMember.findAll({ where: { user_id: req.user.id } });
        const teamIds = memberships.map((m) => m.team_id);

        const projects = await Project.findAll({ where: { team_id: teamIds } });
        const projectIds = projects.map((p) => p.id);

        const tasks = await Task.findAll({
            where: { project_id: projectIds },
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'nom', 'email'] },
                { model: User, as: 'creator', attributes: ['id', 'nom', 'email'] },
                { model: Project, attributes: ['id', 'nom'] },
            ],
        });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: error.message });
    }
}

async function getTaskById(req, res) {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'nom', 'email'] },
                { model: User, as: 'creator', attributes: ['id', 'nom', 'email'] },
                { model: Project, attributes: ['id', 'nom'] },
                { model: TaskUpdate, include: [{ model: User, attributes: ['id', 'nom', 'email'] }] },
            ],
        });

        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la tâche', error: error.message });
    }
}

async function updateTask(req, res) {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        if (!['admin', 'chef_projet'].includes(req.user.role) && task.created_by !== req.user.id) {
            return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres tâches' });
        }

        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error: error.message });
    }
}

async function deleteTask(req, res) {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        await task.destroy();
        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: error.message });
    }
}

async function markAsDone(req, res) {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        await task.update({ statut: 'terminee' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
    }
}

async function addTaskUpdate(req, res) {
    try {
        const { contenu } = req.body;
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }

        const update = await TaskUpdate.create({
            contenu,
            user_id: req.user.id,
            task_id: task.id,
        });

        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'évolution', error: error.message });
    }
}

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask, markAsDone, addTaskUpdate };