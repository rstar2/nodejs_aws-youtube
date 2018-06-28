const AWS = require('aws-sdk');

const { AWS_S3_BUCKET } = require('./config');

// AWS S3 service (by default use the AWS_S3_BUCKET bucket)
const s3 = new AWS.S3({ params: { Bucket: AWS_S3_BUCKET } });


const list = (params, accum = []) => {
    return s3.listObjectsV2(params).promise()
        .then(data => {
            console.log(data);
            if (data.Contents) {
                accum.push(...(data.Contents.map(i => i.Key)));
            }

            if (data.NextContinuationToken) {
                console.log('Next continuation');
                return list({ ...params, ContinuationToken: data.NextContinuationToken }, accum);
            }

            console.log('Finished', accum.length);
            return accum;
        });
};

/**
 * 
 * @return {Promise<String[]>} 
 */
module.exports = (folder) => {
    console.log('Getting list for', folder);
    const params = {
        MaxKeys: 100,
        Delimiter: '/',
        Prefix: `${folder}/`
    };
    return list(params);
};