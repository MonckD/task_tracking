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
        type: DataTypes.ENUM('admin', 'chef_projet', 'developpeur', 'designer'),
        defaultValue: 'developpeur',
    },
}, { //soft delete
    paranoid: true,
});

export default User;