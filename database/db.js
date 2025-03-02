const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('digi_note_db', 'postgres', 'admin123',{

    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});

module.exports = sequelize;
