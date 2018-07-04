const youtube = require('../../lib/youtube');

const aws_transcode = require('../../aws/invoke');
const aws_signed_url = require('../../aws/signed-url');

module.exports = (app) => {
    app.get('/transcode/:videoId', (req, res) => {
        const transcodeMP3 = req.query.mp3 !== undefined;
        const { videoId } = req.params;

        console.log(`Start transcoding of ${videoId}, MP3=${transcodeMP3}`);

        // Get information on the available video file formats.
        youtube(videoId, transcodeMP3)
            // invoke the AWS Lambda - e.g store and transcode will be in the cloud
            .then(data => aws_transcode({ ...data, transcodeMP3 }).then(() => data))

            // Send a response
            .then(data => res.status(200).send(JSON.stringify(data)))
            // Handle errors
            .catch(error => res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}` })));
    });

    app.get('/signed-url/:key', (req, res) => {
        const key = decodeURIComponent(req.params.key);
        const transcodeMP3 = req.query.mp3 !== undefined;
        const isFileKey = req.query.isFileKey === 'true';

        console.log(`Generate signed-url for ${key}, MP3=${transcodeMP3}`);

        let fileKey, logKey;
        if (isFileKey) {
            // the key is actually the whole known fileKey,
            // we are not interested in the logKey,
            // this is when we listed all known file-keys
            // and want to create a signed-url for them
            fileKey = key;
        } else {
            // fileKey can be mp4/xxxxxx.mp4 or mp3/yyyyy.mp3
            // logKey will be log/xxxxxx.log
            fileKey = `${transcodeMP3 ? 'mp3' : 'mp4'}/${key}.${transcodeMP3 ? 'mp3' : 'mp4'}`;
            logKey = `log/${key}.log`;
        }

        aws_signed_url(fileKey, logKey)
            .then(url => {
                // Note - 'url' can be still missing
                res.status(200).send(JSON.stringify({ url }));
            })
            .catch(error => res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}` })));
    });

};