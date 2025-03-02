const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require("./User");

const DiaryEntry = sequelize.define('DiaryEntry', {
    entryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    selectedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dayQuality: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    thoughts: { 
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    highlight: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
});

// Defining relationships
DiaryEntry.belongsTo(User, { foreignKey: 'UserUserId' });
User.hasMany(DiaryEntry, { foreignKey: 'UserUserId' });

module.exports = DiaryEntry;
