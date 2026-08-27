import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';
import User from './User.js';
import Task from './Task.js';

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

TaskUpdate.belongsTo(User, { foreignKey: 'user_id' });
TaskUpdate.belongsTo(Task, { foreignKey: 'task_id' });

export default TaskUpdate;