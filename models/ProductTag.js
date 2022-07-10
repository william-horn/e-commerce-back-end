
const Sequelize = require('sequelize');
const sequelizeConnection = require('../config/sequelizeConnection');

const ProductTag = sequelizeConnection.define('ProductTag', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    product_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Product',
          key: 'id'
        }
    },

    tag_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Tag',
        key: 'id'
      }
  }

}, {
    sequelize: sequelizeConnection,
    timestamps: false,
    freezeTableName: true,
    modelName: 'product_tags',
    underscored: true,
});


module.exports = ProductTag;