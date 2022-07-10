
const Sequelize = require('sequelize');
const sequelizeConnection = require('../config/sequelizeConnection');

const Tag = sequelizeConnection.define('Tag', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    tag_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

}, {
    sequelize: sequelizeConnection,
    timestamps: false,
    freezeTableName: true,
    modelName: 'tags',
    underscored: true,
});


module.exports = Tag;