import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';
import User from './User.js';
import Team from './Team.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lu: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  paranoid: true,
});

Notification.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
Notification.belongsTo(Team, { foreignKey: 'team_id' });

export default Notification;