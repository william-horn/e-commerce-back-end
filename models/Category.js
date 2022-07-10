
const Sequelize = require('sequelize');
const sequelizeConnection = require('../config/sequelizeConnection');

const Category = sequelizeConnection.define('Category', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    category_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

}, {
    sequelize: sequelizeConnection,
    timestamps: false,
    freezeTableName: true,
    modelName: 'categories',
    underscored: true,
});


module.exports = Category;