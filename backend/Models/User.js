import { DataTypes } from 'sequelize';
import { sequelize } from '../Config/config.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('developpeur', 'designer', 'graphiste', 'chef_projet'),
        defaultValue: 'developpeur',
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    // soft delete 
    paranoid: true,
});

export default User;