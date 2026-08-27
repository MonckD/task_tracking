import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';
import User from './User.js';
import Project from './Project.js';
import TaskUpdate from './TaskUpdate.js';

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  statut: {
    type: DataTypes.ENUM('a_faire', 'en_cours', 'terminee'),
    defaultValue: 'a_faire',
  },
  priorite: {
    type: DataTypes.ENUM('basse', 'moyenne', 'haute'),
    defaultValue: 'moyenne',
  },
}, {
  paranoid: true,
});

Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigned_to' });
Task.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
Task.belongsTo(Project, { foreignKey: 'project_id' });
Task.hasMany(TaskUpdate, { foreignKey: 'task_id' });

export default Task;