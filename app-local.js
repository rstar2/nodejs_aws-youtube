const stage = process.env.NODE_ENV || 'dev';

// 'await' requires to be used only inside an 'async' function
const main = async () => {
    const { app, apiRouter, viewRouter } = await require('./app')(stage);
    // load the local routers
    require('./routes/api/local')(apiRouter);
    require('./routes/view/local')(viewRouter);

    // run the Express server locally on port 3000
    app.listen(3000);
};

main();