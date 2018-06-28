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

/**
 * Factory method
 * @return {Promise<{app:Express, apiRouter:Router, viewRouter: Router}>}
 */
module.exports = (prefix = '') => {
    const app = express();
    // the root folder for the template views
    app.set('views', path.join(__dirname, 'views'));
    // Register `hbs` as our view engine using its bound `engine()` function.
    app.engine('hbs', hbs.engine);
    // use the Handlebars engine
    app.set('view engine', 'hbs');

    app.use('/public', express.static('public'));


    if (prefix && !prefix.startsWith('/')) {
        prefix = `/${prefix}`;
    }

    // configure routes
    const apiRouter = express.Router();

    app.use(`${prefix}/api`, apiRouter);
    require('./routes/api/common')(apiRouter);

    const viewRouter = express.Router();
    app.use(`${prefix}/view`, viewRouter);
    require('./routes/view/common')(viewRouter);

    return Promise.resolve({
        app,
        apiRouter,
        viewRouter,
    });
};