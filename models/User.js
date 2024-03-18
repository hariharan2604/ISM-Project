// Assuming you have Sequelize already set up and connected to your database

const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
// Define your Sequelize model
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
module.exports = User;
