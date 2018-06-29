const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
const request = require('request');
const tempy = require('tempy');

require('../utils/promise');

// TODO: Add the ./exodus/bin/ffmpeg to the PATH
const ffmpeg = path.resolve(__dirname, '..', 'exodus', 'bin', 'ffmpeg');
console.log(ffmpeg);
process.env.PATH = process.env.PATH + ':' + ffmpeg;
console.log(process.env.PATH);

const transcode = require('../lib/mp3-process');
const { AWS_S3_BUCKET } = require('./config');

// AWS S3 service (by default use the AWS_S3_BUCKET bucket)
const s3 = new AWS.S3({ signatureVersion: 'v4', params: { Bucket: AWS_S3_BUCKET } });

const sanitizeFilename = (name) => {
    return encodeURIComponent(name.replace('"', '\''));
};

const createKey = (key, type) => `${type}/${key}.${type}`;

exports.handler = (event, context, callback) => {
    // We're going to do the transcoding asynchronously, so we callback immediately.
    callback();

    // Extract the event parameters.
    // NOTE - the function can be invoked only programmatically
    const { key, filename, url, transcodeMP3 } = event;
    const fileKey = createKey(key, transcodeMP3 ? 'mp3' : 'mp4');
    const logKey = createKey(key, 'log');

    // Create temporary input/output filenames that we can clean up afterwards.
    const inputFilename = tempy.file();
    const outputFilename = transcodeMP3 ? tempy.file({ extension: 'mp3' }) : inputFilename;

    // Download the source file.
    new Promise((resolve, revoke) => {
        const writeStream = fs.createWriteStream(inputFilename);
        writeStream.on('finish', resolve);
        writeStream.on('error', revoke);
        request(url).pipe(writeStream);
    })
        // Perform the actual transcoding.
        .then(() => transcodeMP3 ? transcode(inputFilename, outputFilename) : 'No MP3 transcoding')

        // Upload the generated MP3 to S3.
        .then(logContent => {
            return s3.putObject({
                Key: fileKey,
                Body: fs.createReadStream(outputFilename),
                ContentType: 'audio/mpeg',
                ContentDisposition: `attachment; filename="${sanitizeFilename(filename)}"`,
            }).promise()
                .then(() => {
                    const logFilename = path.basename(logKey);
                    return s3.putObject({
                        Key: logKey,
                        Body: logContent,
                        ContentType: 'text/plain',
                        ContentDisposition: `inline; filename="${sanitizeFilename(logFilename)}"`,
                    }).promise();
                });
        })

        // Always delete the temporary files.
        .always(() => {
            [inputFilename, outputFilename].forEach((filename) => {
                if (fs.existsSync(filename)) {
                    fs.unlinkSync(filename);
                }
            });
        })
        // just trace it and rethrow it
        .catch(error => {
            console.error(error);
            throw error;
        });
};