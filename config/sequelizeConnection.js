const Sequelize = require('sequelize');
require('dotenv').config(); // pull env vars

const sequelizeConnection = process.env.JAWSDB_URL || new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  dialectOptions: {
    decimalNumbers: true,
  },
});

module.exports = sequelizeConnection;
