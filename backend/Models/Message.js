import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';

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

export default Message;