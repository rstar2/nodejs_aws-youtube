const path = require('path');

// load the .env file into process.env
require('dotenv').config({ path: path.resolve(__dirname, '.env-local') });

// 'await' requires to be used only inside an 'async' function
(async () => {
    const { app, apiRouter, viewRouter } = await require('./app')();
    // load the local routers
    require('./routes/api/local')(apiRouter);
    require('./routes/view/local')(viewRouter);

    // run the Express server locally
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`YouTube Downloader app listening on port ${port}!`));
})();