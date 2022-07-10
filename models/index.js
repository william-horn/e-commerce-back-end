// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');


// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
})

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
})

Product.belongsToMany(Tag, {
  through: { model: ProductTag },
  foreignKey: 'product_id'
});

Tag.belongsToMany(Product, {
  through: { model: Tag },
  foreignKey: 'tag_id'
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
