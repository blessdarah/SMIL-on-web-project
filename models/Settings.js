const Sequelize = require('sequelize');
const sequelize = require('../database');

const Settings = sequelize.define('settings', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    smilPlayerPath: {
        type: Sequelize.STRING,
        default: "",
    }
});

module.exports = Settings;