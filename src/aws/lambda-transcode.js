const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
const request = require('request');
const tempy = require('tempy');

require('../utils/promise');

const transcode = require('../lib/mp3-process');
const { AWS_S3_BUCKET } = require('./config');

// AWS S3 service (by default use the AWS_S3_BUCKET bucket)
const s3 = new AWS.S3({ signatureVersion: 'v4', params: { Bucket: AWS_S3_BUCKET } });

const sanitizeFilename = (name) => {
    return encodeURIComponent(name.replace('"', '\''));
};

const createKey = (key, type) => `${type}/${key}.${type}`;

/**
 * 
 * @param {String} url URL do request and download
 * @param {String} outputFilename the filename where to download to URL
 * @return {Promise}
 */
const downloadFile = (url, outputFilename) => {
    return new Promise((resolve, revoke) => {
        const writeStream = fs.createWriteStream(outputFilename);
        writeStream.on('finish', resolve);
        writeStream.on('error', revoke);
        request(url).pipe(writeStream);
    });
}

exports.handler = (event, context, callback) => {
    // Specify where the ffmpeg is to be found 
    const ffmpeg = path.resolve(__dirname, '../../exodus/bin/ffmpeg');
    process.env.FFMPEG_PATH = ffmpeg;

    // We're going to do the transcoding asynchronously, so we callback immediately.
    callback();

    // Extract the event parameters.
    // NOTE - the function can be invoked only programmatically
    const { key, filename, url, transcodeMP3 } = event;
    const fileKey = createKey(key, transcodeMP3 ? 'mp3' : 'mp4');
    const logKey = createKey(key, 'log');

    // Create temporary input/output filenames that we can clean up afterwards.
    const youtubeFilename = tempy.file();
    const resultFilename = transcodeMP3 ? tempy.file({ extension: 'mp3' }) : youtubeFilename;

    console.log('Download file:', filename, ' on url:', url);

    // Download the source file.
    downloadFile(url, youtubeFilename)
        // Perform the actual transcoding.
        .then(() => transcodeMP3 ? transcode(youtubeFilename, resultFilename) : 'No MP3 transcoding')

        // Upload the result file (the MP4, or the transcoded MP3) to S3.
        .then(logContent => {
            console.log('Transcode result:', logContent);

            return s3.putObject({
                Key: fileKey,
                Body: fs.createReadStream(resultFilename),
                ContentType: transcodeMP3 ? 'audio/mpeg' : 'video/mp4',
                ContentDisposition: `attachment; filename="${sanitizeFilename(filename + (transcodeMP3 ? '.mp3' : ''))}"`,
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
            [youtubeFilename, resultFilename].forEach((filename) => {
                if (fs.existsSync(filename)) {
                    fs.unlinkSync(filename);
                }
            });
        })
        // just trace it,
        // we already have called the AWS Lambda's callback, so nothing more to do
        .catch(error => {
            console.error(error);
        });
};