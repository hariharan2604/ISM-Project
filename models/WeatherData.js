const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const WeatherData = sequelize.define('WeatherData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    humidity: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    pressure: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'weather_data',
    timestamps: false
});

module.exports = WeatherData;
