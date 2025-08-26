const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'production'; //console.log(env);
const config = require('./config.json')[env]; //console.log(config);
// console.log(config);
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.portdb,
    logging: console.log,
});

module.exports = sequelize;
