const youtube = require('../../lib/youtube');

const aws_transcode = require('../../aws/invoke');
const aws_check = require('../../aws/signed-url');

module.exports = (app) => {
    app.get('/transcode/:videoId', (req, res) => {
        const transcodeMP3 = req.query.mp3 !== undefined;
        const { videoId } = req.params;

        // Get information on the available video file formats.
        youtube(videoId, transcodeMP3)
            // invoke the AWS Lambda - e.g store and transcode will be in the cloud
            .then(data => aws_transcode({ ...data, transcodeMP3 }).then(() => data))

            // Send a response
            .then(data => res.status(200).send(JSON.stringify(data)))
            // Handle errors
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

    app.get('/signed-url/:logKey/:fileKey', (req, res) => {
        const logKey = decodeURIComponent(req.params.logKey);
        const fileKey = decodeURIComponent(req.params.fileKey);

        aws_check(logKey, fileKey)
            .then(data => res.status(200).send(JSON.stringify(data)))
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

};