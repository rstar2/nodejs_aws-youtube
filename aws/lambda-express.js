// if using 'aws-serverless-express'
// const awsServerlessExpress = require('aws-serverless-express');

// if using 'serverless-http'
const serverless = require('serverless-http');

// this is explicitly set in 'serverless.yml' as environment-variable
const stage = process.env.stage;

exports.handler = (event, context, callback) => {
    require('../app')({ stage, isLocal: false })
        .then(({ app, apiRouter, viewRouter }) => {
            // load the AWS specific routers
            require('../routes/api/aws')(apiRouter);
            require('../routes/view/aws')(viewRouter);

            // if using 'aws-serverless-express'
            // const server = awsServerlessExpress.createServer(app);
            // awsServerlessExpress.proxy(server, event, context);

            // if using 'serverless-http'
            serverless(app)(event, context, callback);
        });

};