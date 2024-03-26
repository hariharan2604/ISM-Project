// Assuming you have Sequelize already set up and connected to your database
const { DataTypes } = require('sequelize');
const sequelize = require("../db/database");

    const RegisteredIP = sequelize.define('RegisteredIPS', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        tableName: 'registeredips',
        timestamps: false
    }
);

module.exports = RegisteredIP;