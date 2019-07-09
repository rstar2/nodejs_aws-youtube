// if using 'aws-serverless-express'
// const awsServerlessExpress = require('aws-serverless-express');

// if using 'serverless-http'
const serverless = require('serverless-http');

// this is explicitly set in 'serverless.yml' as environment-variable
const stage = process.env.stage;

exports.handler = async (event, context) => {
    const { app, apiRouter, viewRouter } = await require('../app')({ stage, isLocal: false });
    // load the AWS specific routers
    require('../routes/api/aws')(apiRouter);
    require('../routes/view/aws')(viewRouter);

    // if using 'aws-serverless-express'
    // const server = awsServerlessExpress.createServer(app);
    // awsServerlessExpress.proxy(server, event, context);

    // if using 'serverless-http'
    const result = await serverless(app)(event, context);
    return result;
};