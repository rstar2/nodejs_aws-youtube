const AWS = require('aws-sdk');

const { AWS_S3_BUCKET } = require('./config');

// AWS S3 service (by default use the AWS_S3_BUCKET bucket)
const s3 = new AWS.S3({ signatureVersion: 'v4', params: { Bucket: AWS_S3_BUCKET } });

/**
 * 
 * @param {String} fileKey
 * @param {String} logKey 
 * @return {Promise<{url?:String}>} 
 */
module.exports = (fileKey, logKey) => {
    return new Promise((resolve, reject) => {
        console.log('headObject', logKey || fileKey);
        s3.headObject({
            Key: logKey || fileKey,
        }, (error) => {
            if (error) {
                console.log('Got error while headObject for key', logKey || fileKey, error);
                if (error.code === 'NotFound') {
                    resolve(null);
                    return;
                }
                reject(error);
                return;
            }

            console.log('getSignedUrl', fileKey);

            // pre-sign a 'getObject' call to the SDK -that will expires after 3600 seconds
            s3.getSignedUrl('getObject', {
                Expires: 3600,
                Key: fileKey,
            }, (error, url) => {
                if (error) {
                    console.log('Got error while getSignedUrl', error);
                    reject(error);
                    return;
                }

                console.log('Got getSignedUrl for', fileKey, url);
                resolve(url);
            });
        })
    });
};