import Project from '../Models/Project.js';
import Team from '../Models/Team.js';

async function createProject(req, res) {
  try {
    const { nom, description, deadline, team_id } = req.body;
    const team = await Team.findByPk(team_id);
    if (!team) {
      return res.status(404).json({ message: 'Équipe non trouvée' });
    }
    const project = await Project.create({ nom, description, deadline, team_id });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du projet', error: error.message });
  }
}

async function getAllProjects(req, res) {
  try {
    const projects = await Project.findAll({
      include: [{ model: Team, attributes: ['id', 'nom'] }],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des projets', error: error.message });
  }
}

async function getProjectById(req, res) {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{ model: Team, attributes: ['id', 'nom'] }],
    });
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du projet', error: error.message });
  }
}

async function updateProject(req, res) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du projet', error: error.message });
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    await project.destroy();
    res.json({ message: 'Projet supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du projet', error: error.message });
  }
}

export { createProject, getAllProjects, getProjectById, updateProject, deleteProject };