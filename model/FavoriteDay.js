const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const FavoriteDay = sequelize.define('FavoriteDay', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    diaryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
const DiaryEntry = require('./DiaryEntry'); 

FavoriteDay.belongsTo(DiaryEntry, { foreignKey: 'diaryId' });

module.exports = FavoriteDay;
