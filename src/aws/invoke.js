const AWS = require('aws-sdk');

const { AWS_LAMBDA_TRANSCODE } = require('./config');

// AWS Lambda service
const lambda = new AWS.Lambda();

/**
 * Transcode using a AWS Lambda function, e.g trigger the AWS Lambda function.
 * @param {Object} data 
 * @return {Promise}
 */
module.exports = (data, func = AWS_LAMBDA_TRANSCODE) => {
    return lambda.invoke({
        FunctionName: func,
        InvocationType: 'Event',
        Payload: JSON.stringify(data),
    }).promise();
};
