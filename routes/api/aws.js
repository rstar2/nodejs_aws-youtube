const youtube = require('../../lib/youtube');

const aws_transcode = require('../../aws/invoke');
const aws_signed_url = require('../../aws/signed-url');

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

    app.get('/signed-url/:key', (req, res) => {
        const fileKey = decodeURIComponent(req.params.key);

        // fileKey can be mp4/xxxxxx.mp4 or mp3/yyyyy.mp3
        // so we have to replace the prefix and suffix
        // just in case don't replace all mp3 (or mp4) as there's a risk this to be also in the name
        // so just replace both 'mp4/' and '.mp4' 
        const logKey = fileKey.replace(/mp[34]\//, 'log/').replace(/\.mp[34]/, '.log');

        aws_signed_url(fileKey, logKey)
            .then(url => {
                if (!url) {
                    res.status(500).send(`No file with ${fileKey} yet`);
                } else {
                    res.status(200).send(url);
                }
            })
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

};