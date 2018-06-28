const AWS = require('aws-sdk');

const { AWS_S3_BUCKET } = require('./config');

// AWS S3 service (by default use the AWS_S3_BUCKET bucket)
const s3 = new AWS.S3({ params: { Bucket: AWS_S3_BUCKET } });

/**
 * 
 * @param {String} logKey 
 * @param {String} fileKey
 * @return {Promise<{url?:String}>} 
 */
module.exports = (logKey, fileKey) => {
    // just for change don't use the s3.headObject().promise() syntax
    return new Promise((resolve, reject) => {
        s3.headObject({
            Key: logKey,
        }, (error) => {
            if (error) {
                if (error.code === 'NotFound') {
                    resolve({ url: null });
                    return;
                }
                reject(error);
                return;
            }

            // pre-sign a 'getObject' call to the SDK -that will expires after 3600 seconds
            s3.getSignedUrl('getObject', {
                Expires: 3600,
                Key: fileKey,
            }, (error, url) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ url });
            });
        });
    });
};