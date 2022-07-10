
const Sequelize = require('sequelize');
const sequelizeConnection = require('../config/sequelizeConnection');

const Product = sequelizeConnection.define('Product', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    product_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },

    stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Category',
            key: 'id'
        }
    }

}, {
    sequelize: sequelizeConnection,
    timestamps: false,
    freezeTableName: true,
    modelName: 'products',
    underscored: true,
});


module.exports = Product;