import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';

const TaskUpdate = sequelize.define('TaskUpdate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  paranoid: true,
});

export default TaskUpdate;