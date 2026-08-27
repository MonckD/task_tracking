import Task from '../Models/Task.js';
import TaskUpdate from '../Models/TaskUpdate.js';
import User from '../Models/User.js';
import Project from '../Models/Project.js';
import TeamMember from '../Models/TeamMember.js';

async function getMembershipRole(userId, teamId) {
  if (teamId === null || teamId === undefined) return null;
  const membership = await TeamMember.findOne({ where: { user_id: userId, team_id: teamId } });
  return membership ? membership.role_dans_equipe : null;
}

async function createTask(req, res) {
  try {
    const { titre, description, statut, priorite, assigned_to, project_id } = req.body;

    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    let finalAssignedTo = assigned_to;

    if (req.user.is_admin !== true) {
      const role = await getMembershipRole(req.user.id, project.team_id);
      if (!role) {
        return res.status(403).json({ message: 'Vous n\'êtes pas membre de l\'équipe de ce projet' });
      }

      if (role !== 'chef_projet') {
        finalAssignedTo = req.user.id;
      }
    }

    const task = await Task.create({
      titre,
      description,
      statut,
      priorite,
      assigned_to: finalAssignedTo,
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
    if (req.user.is_admin === true) {
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

    if (req.user.is_admin !== true) {
      const project = await Project.findByPk(task.project_id);
      const role = await getMembershipRole(req.user.id, project ? project.team_id : null);
      if (!role) {
        return res.status(403).json({ message: 'Vous n\'avez pas accès à cette tâche' });
      }
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

    if (req.user.is_admin !== true) {
      const project = await Project.findByPk(task.project_id);
      const role = await getMembershipRole(req.user.id, project ? project.team_id : null);

      if (!role) {
        return res.status(403).json({ message: 'Vous n\'avez pas accès à cette tâche' });
      }

      if (role !== 'chef_projet' && task.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres tâches' });
      }
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

    if (req.user.is_admin !== true) {
      const project = await Project.findByPk(task.project_id);
      const role = await getMembershipRole(req.user.id, project ? project.team_id : null);

      if (!role) {
        return res.status(403).json({ message: 'Vous n\'avez pas accès à cette tâche' });
      }

      if (role !== 'chef_projet' && task.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres tâches' });
      }
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

    if (req.user.is_admin !== true) {
      const project = await Project.findByPk(task.project_id);
      const role = await getMembershipRole(req.user.id, project ? project.team_id : null);

      if (!role) {
        return res.status(403).json({ message: 'Vous n\'avez pas accès à cette tâche' });
      }

      if (role !== 'chef_projet' && task.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Vous ne pouvez marquer terminée que vos propres tâches' });
      }
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

    if (req.user.is_admin !== true) {
      const project = await Project.findByPk(task.project_id);
      const role = await getMembershipRole(req.user.id, project ? project.team_id : null);

      if (!role) {
        return res.status(403).json({ message: 'Vous n\'avez pas accès à cette tâche' });
      }

      if (role !== 'chef_projet' && task.created_by !== req.user.id) {
        return res.status(403).json({ message: 'Vous ne pouvez ajouter une évolution qu\'à vos propres tâches' });
      }
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