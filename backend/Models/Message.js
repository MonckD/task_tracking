import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';
import User from './User.js';
import Team from './Team.js';

const Message = sequelize.define('Message', {
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

Message.belongsTo(User, { as: 'sender', foreignKey: 'sender_id' });
Message.belongsTo(Team, { foreignKey: 'team_id' });

export default Message;