
const router = require('express').Router();
const { Category } = require('../../models');
const createQuerier = require('../../utils/createQuerier');

const querier = createQuerier(Category, 'Category');
querier.definePlurals({ Category: 'Categories' });

const { 
    getCategory, 
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = querier.init();

// traverse all categories
const root_GET = async (req, res) => {
    try {

        const categoryData = await getAllCategories();
        res.status(200).json(categoryData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// create new Category
const root_POST = async (req, res) => {
    try {

        const categoryData = await createCategory(req.body);
        res.status(200).json(categoryData);

    } catch (err) {

        console.log(err);
        res.status(400).json(err);

    }
}

// get Category by id
const rootID_GET = async (req, res) => {
    // find one Category by its `id` value
    try {

        const categoryData = await getCategory(req.params.id);
        res.status(200).json(categoryData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// update Category by id
const rootID_PUT = async (req, res) => {
    try {

        const categoryData = await updateCategory(req.params.id, req.body);
        res.status(200).json(categoryData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// delete Category by id
const rootID_DELETE = async (req, res) => {
    try {

        const response = await deleteCategory(req.params.id);
        res.status(200).json(response);

    } catch (err) {

        console.log(err);
        res.status(400).json(err);

    }
}

// for all 'root/api/categories' routes
router
    .route('/')
    .get(root_GET)
    .post(root_POST)

// for all 'root/api/categories/id' routes
router
    .route('/:id')
    .get(rootID_GET)
    .put(rootID_PUT)
    .delete(rootID_DELETE);


module.exports = router;


