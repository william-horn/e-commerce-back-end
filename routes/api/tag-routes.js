
const router = require('express').Router();
const { Tag } = require('../../models');
const createQuerier = require('../../utils/createQuerier');

const querier = createQuerier(Tag, 'Tag');

const { 
    getTag, 
    getAllTags,
    createTag,
    updateTag,
    deleteTag
} = querier.init();

// traverse all Tags
const root_GET = async (req, res) => {
    try {

        const tagData = await getAllTags();
        res.status(200).json(tagData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// create new Tag
const root_POST = async (req, res) => {
    try {
        
        const tagData = await createTag(req.body);
        res.status(200).json(tagData);

    } catch (err) {

        console.log(err);
        res.status(400).json(err);

    }
}

// get Tag by id
const rootID_GET = async (req, res) => {
    // find one Tag by its `id` value
    try {

        const tagData = await getTag(req.params.id);
        res.status(200).json(tagData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// update Tag by id
const rootID_PUT = async (req, res) => {
    try {

        const tagData = await updateTag(req.params.id, req.body);
        res.status(200).json(tagData);

    } catch (err) {

        console.log(err);
        res.status(500).json(err);

    }
}

// delete Tag by id
const rootID_DELETE = async (req, res) => {
    try {

        const response = await deleteTag(req.params.id);
        res.status(200).json(response);

    } catch (err) {

        console.log(err);
        res.status(400).json(err);

    }
}

// for all 'root/api/Tags' routes
router
    .route('/')
    .get(root_GET)
    .post(root_POST)

// for all 'root/api/Tags/id' routes
router
    .route('/:id')
    .get(rootID_GET)
    .put(rootID_PUT)
    .delete(rootID_DELETE);


module.exports = router;


