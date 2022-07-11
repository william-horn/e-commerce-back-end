
const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const createQuerier = require('../../utils/createQuerier');

const querier = createQuerier(Product, 'Product', [Category, Tag]);

const { 
    getProduct, 
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = querier.init();

const createProductTag = async (product_id, tagIdList) => {
    if (tagIdList) {
        tagIdList = tagIdList.map(tag_id => ({ product_id, tag_id }));
        console.log('tag ids: ', tagIdList);
        await ProductTag.bulkCreate(tagIdList);
    }
};

// traverse all categories
const root_GET = async (req, res) => {
    try {

        const productData = await getAllProducts();
        res.status(200).json(productData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// create new product
const root_POST = async (req, res) => {
    try {

        const productData = await createProduct(
            req.body, 
            async newProduct => await createProductTag(newProduct.id, req.body.tag_ids)
        );

        res.status(200).json(productData);

    } catch (err) {

        console.log(err);
        res.status(400).json(err);

    }
}

// get product by id
const rootID_GET = async (req, res) => {
    // find one product by its `id` value
    try {

        const productData = await getProduct(req.params.id);
        res.status(200).json(productData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// update product by id
const rootID_PUT = async (req, res) => {
    try {

        const productData = await updateProduct(
            req.params.id, 
            req.body, 
            async () => await createProductTag(req.params.id, req.body.tag_ids)
        );

        res.status(200).json(productData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// delete product by id
const rootID_DELETE = async (req, res) => {
    try {

        const response = await deleteProduct(req.params.id);
        res.status(200).json(response);

    } catch (err) {

        console.log(err);
        res.status(400).json(err);

    }
}

// for all 'root/api/products' routes
router
    .route('/')
    .get(root_GET)
    .post(root_POST)

// for all 'root/api/products/id' routes
router
    .route('/:id')
    .get(rootID_GET)
    .put(rootID_PUT)
    .delete(rootID_DELETE);


module.exports = router;


