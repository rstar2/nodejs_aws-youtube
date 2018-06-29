const awsServerlessExpress = require('aws-serverless-express');

// this is explicitly set in 'serverless.yml' as environment-variable
const stage = process.env.stage;

exports.handler = (event, context) => {
    require('../app')({ stage, isLocal: false })
        .then(({ app, apiRouter, viewRouter }) => {
            // load the AWS specific routers
            require('../routes/api/aws')(apiRouter);
            require('../routes/view/aws')(viewRouter);

            const server = awsServerlessExpress.createServer(app);
            awsServerlessExpress.proxy(server, event, context);
        });

};