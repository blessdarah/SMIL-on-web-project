const Sequelize = require('sequelize');
const sequelize = require('../database');

const SmilModel = sequelize.define('smil', {
    smil_id: {
        type: Sequelize.STRING,
        autoIncrement: false,
        allowNull: false,
        primaryKey: true
    },
    // file: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    contentType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 1
    },
    delay: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0
    },
    leftPosition: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0
    },
    rightPosition: {
        type: Sequelize.INTEGER,
        allowNull: true,
        default: 0
    }
});

module.exports = SmilModel;