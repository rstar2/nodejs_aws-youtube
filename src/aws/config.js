// this is default AWS environment variable available when the function is executed
// exports.AWS_REGION = process.env.AWS_REGION;

// get from the custom defined environment variables (in serverless.yml)
exports.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
exports.AWS_LAMBDA_TRANSCODE = process.env.AWS_LAMBDA_TRANSCODE;