const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'smil_db',
    'admin',
    'password', {
        dialect: 'sqlite',
        host: 'localhost',
        storage: 'db.sqlite',
        freezeTableName: true,
        operatorAliases: false
    }
);

module.exports = sequelize;