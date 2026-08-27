import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';

const TeamMember = sequelize.define('TeamMember', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_dans_equipe: {
    type: DataTypes.ENUM('developpeur', 'designer', 'graphiste', 'chef_projet'),
    defaultValue: 'developpeur',
  },
}, {
  paranoid: true,
});

export default TeamMember;