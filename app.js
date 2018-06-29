const path = require('path');

const express = require('express');
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    // if Express 'view' setting is changed these values also has to be reflected
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main',
    helpers: require('./views/helpers'),
    extname: '.hbs',
});
require('express-handlebars-sections')(hbs);

// register a whole lot of useful helpers
require('handlebars-helpers')({
    handlebars: hbs.handlebars  // Note hbs.handlebars returns the internal Handlebars instance
});

// load the .env file into process.env
require('dotenv').config();

/**
 * Factory method
 * @return {Promise<{app:Express, apiRouter:Router, viewRouter: Router}>}
 */
module.exports = ({ stage = '', isLocal = true } = {}) => {
    const app = express();
    // the root folder for the template views
    app.set('views', path.join(__dirname, 'views'));
    // Register `hbs` as our view engine using its bound `engine()` function.
    app.engine('hbs', hbs.engine);
    // use the Handlebars engine
    app.set('view engine', 'hbs');

    // from Express 4.16 they are back in the core
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // app.use(express.multipart());

    app.use('/public', express.static('public'));

    // set the stage as global local template variable (e.g. accessible in all routes)
    app.locals["context-path"] = stage ? '/' + stage : '';
    app.locals["isLocal"] = isLocal;

    // configure routes
    const apiRouter = express.Router();

    app.use('/api', apiRouter);
    require('./routes/api/common')(apiRouter);

    const viewRouter = express.Router();
    app.use('/view', viewRouter);
    require('./routes/view/common')(viewRouter);

    return Promise.resolve({
        app,
        apiRouter,
        viewRouter,
    });
};