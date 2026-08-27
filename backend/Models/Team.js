import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';
import User from './User.js';
import TeamMember from './TeamMember.js';
import Project from './Project.js';

const Team = sequelize.define('Team', {
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
}, {
    paranoid: true,
});

Team.belongsToMany(User, { through: TeamMember, as: 'members', foreignKey: 'team_id' });
User.belongsToMany(Team, { through: TeamMember, as: 'teams', foreignKey: 'user_id' });
Team.hasMany(Project, { foreignKey: 'team_id' });
Project.belongsTo(Team, { foreignKey: 'team_id' });

export default Team;