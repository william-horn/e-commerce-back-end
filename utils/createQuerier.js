/*
    Author: William J. Horn
    Created: 7/10/2022

    Helper: Querier

    -- About --

    This is a mini-helper library created by William Horn for the intention of generalizing 
    generic sequelize queries such as getting all table rows or getting a specific table
    row with/without inclusive data.

    -- API --

    Leaving this here as a reminder for myself but on the off chance anyone is interested
    in using this, here is the API:

    ============================
    Example #1 (with one model):
    ============================

    /// require a sequelize model
    const { Post } = require('.../models');

    const createQuerier = require('.../createQuerier');
    const querier = createQuerier(Post, 'Post');
    const { getPost, getAllPosts } = querier.init();

    (async () => {
        const singlePost = getPost(id);
        const allPosts = await getAllPosts();
    })()

    ============================================
    Example #2 (with multiple inclusive models):
    ============================================

    /// require a sequelize model
    const { Post, Comment, Reply } = require('.../models');

    const createQuerier = require('.../createQuerier');
    const querier = createQuerier(Post, 'Post', [Comment, Reply]);
    const { getPost, getAllPosts } = querier.init();

    (async () => {
        const singlePost = getPost(id);         // gets a single post (with comments and replies included)
        const allPosts = await getAllPosts();   // gets all posts (with comments and replies included)
    })()

    ============================================
    ============================================
    ============================================
*/

/*
? note to self: there might be an easier way to do this. look into later.
purpose: convert words separated by underscores to an upper-camel-case string
with no underscores
*/
const toUpperCamelCase = str => str
    .replace(/(\w+)/g, (_, cap) => cap.charAt(0).toUpperCase() + cap.slice(1))
    .replaceAll('_', '');



/*
pluralize a string based on a map on singular to plural, or
just append an 's'
*/
const pluralize = (word, map) => {
    let plural;

    if (map && map[word]) {
        plural = map[word];
    } else {
        plural = word + 's';
    }

    // console.log(`pluralized word: '${word}' to: '${plural}'`);
    return toUpperCamelCase(plural);
}


/*
? function: createQuerier

purpose: responsible for creating a new querier instance.

example:
    const querier = createQuerier(Product, 'Product', [Category, Tag]);
    querier.definePlurals({ Product: 'ducks' });
    
    const { getProduct, getAllDucks } = querier.init();
*/
const createQuerier = (model, modelNameSingular, includeList) => {

    // convert model name to upper camel case 
    modelNameSingular = toUpperCamelCase(modelNameSingular);

    // all environment variables
    const env = {
        pluralsLookup: {}
    };

    // all package metadata
    const metadata = {};

    // functions that should run before the initializer runs
    const bootware = {};

    // all exports with package metadata
    const package = { 
        env, 
        metadata, 
        bootware 
    };

    /*
    * bootware SETTER: definePlurals(pluralMap[Object<Map>])

    purpose: takes an object of singular words mapped to
    their corresponding plurals for more accurate method names.

    ? without using this method:

        const querier = createQuerier(model, 'Person')
        const { getPerson, getAllPersons } = querier

    ? with using this method:

        const querier = createQuerier(model, 'Person')
        querier.definePlurals({ person: 'people' });

        const { getPerson, getAllPeople } = querier
    */
    bootware.definePlurals = function(aliases) {
        const plurals = env.pluralsLookup;
        env.pluralsLookup = {
            ...plurals,
            ...aliases
        }
    }

    bootware.init = () => {

        // set method names
        metadata.getterName_getRow = `get${modelNameSingular}`;
        metadata.getterName_getAllRows = `getAll${pluralize(modelNameSingular, env.pluralsLookup)}`;
        metadata.setterName_postRow = `create${modelNameSingular}`;
        metadata.setterName_updateRow = `update${modelNameSingular}`;
        metadata.setterName_deleteRow = `delete${modelNameSingular}`;

        /*
        * query GETTER: getRow(?id[Integer])
        ? = optional

        purpose: should return a json object at a specific
        index of @params model given some id value. if no id
        value is given then return all table rows.
        */
        const getter_getRow = async id => {
            const options = {};

            if (includeList) options.include = includeList;
            if (id) options.where = { id };
        
            const queryData = await model.findAll(options)
                .map(data => data.get({ plain: true }));
        
            return queryData;
        }

        /*
        * query GETTER: getAllRows()

        purpose: shorthand for calling 'getRow' except we 
        explicitly provide no 'id' argument for clarity.
        */
        const getter_getAllRows = async () => 
            await package[metadata.getterName_getRow]();


        /*
        * query SETTER: postRow(data[Object<Map>])

        purpose: shorthand for calling 'model.create', with the
        addition of returning the full database entry as a result
        instead of just the posted data
        */
        const setter_setRow = async (data, callback) => {
            const response = (await model.create(data))
                .get({ plain: true});

            if (callback) await callback(response);
      
            const savedData = await getter_getRow(response.id);
            return savedData;
        }

        /*
        * query SETTER: updateRow(data[Object<Map>])

        purpose: shorthand for calling 'model.update' with the
        addition of returning the actual database entry after
        updating
        */
        const setter_updateRow = async (id, newData, callback) => {
            const response = await model.update(newData, {
                where: { id }
            });

            if (callback) await callback(response);
      
            const savedData = await getter_getRow(id);
            return savedData;
        }

        /*
        * query SETTER: deleteRow(id[Integer])

        purpose: shorthand for calling 'model.destroy'
        */
        const setter_deleteRow = async id => {
            const response = await model.destroy({
                where: { id }
            });
      
            return { message: 'row deleted' };
        }


        package[metadata.getterName_getRow] = getter_getRow;
        package[metadata.getterName_getAllRows] = getter_getAllRows;
        package[metadata.setterName_postRow] = setter_setRow;
        package[metadata.setterName_updateRow] = setter_updateRow;
        package[metadata.setterName_deleteRow] = setter_deleteRow;

        // console.log('package after init: ', package);
        return package;
    }

    return bootware;
}

module.exports = createQuerier;