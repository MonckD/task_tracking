import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  paranoid: true,
});

export default Project;