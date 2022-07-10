
const express = require('express');
const routes = require('./routes');
const sequelizeConnection = require('./config/sequelizeConnection');
const seedAll = require('./seeds');
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelizeConnection.sync()
    .then(async () => {
        await seedAll();
        app.listen(PORT);
    });