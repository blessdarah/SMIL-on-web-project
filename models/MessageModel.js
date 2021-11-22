const Sequelize = require('sequelize');
const sequelize = require('../database');

const MessageModel = sequelize.define('messages', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    isSent: {
        type: Sequelize.BOOLEAN,
        default: true
    },

    resendCount: {
        type: Sequelize.INTEGER,
        default: 0
    },
});

module.exports = MessageModel;