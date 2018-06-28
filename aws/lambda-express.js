const awsServerlessExpress = require('aws-serverless-express');

exports.handler = (event, context) => {
    require('../app')()
        .then(({ app, apiRouter, viewRouter }) => {
            // load the AWS specific routers
            require('../routes/api/aws')(apiRouter);
            require('../routes/view/aws')(viewRouter);

            const server = awsServerlessExpress.createServer(app);
            awsServerlessExpress.proxy(server, event, context);
        });

};