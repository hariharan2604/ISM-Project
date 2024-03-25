// Assuming you have Sequelize already set up and connected to your database
const { DataTypes } = require('sequelize');
const sequelize = require("../db/database");

const BlacklistedIP = sequelize.define('BlacklistedIP', {
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
    tableName: 'blacklistedip',
    timestamps: false
}
);

module.exports = BlacklistedIP;