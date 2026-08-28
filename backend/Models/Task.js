import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';

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

export default Task;