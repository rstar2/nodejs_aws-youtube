const youtube = require('../../lib/youtube');
const store = require('../../lib/store');
const download = require('../../lib/download');
const transcode = require('../../lib/mp3-process');
const transcodeStream = require('../../lib/mp3-stream');

const aws_signed_url = require('../../aws/signed-url');

module.exports = (app) => {
    app.get('/store/:videoId', (req, res) => {
        const transcodeMP3 = req.query.mp3 !== undefined;
        const { videoId } = req.params;

        // Get information on the available video file formats.
        youtube(videoId, transcodeMP3)
            // download locally
            .then(data => {
                const { filename, url } = data;

                // first download locally
                let promise = store(url, filename);

                // Perform the actual transcoding if needed
                if (transcodeMP3) {
                    promise = promise.then(() => transcode(filename, filename + '.mp3'));
                }

                return promise.then(() => data);
            })

            // Send a response
            .then(data => res.status(200).send(JSON.stringify(data)))
            // Handle errors
            .catch((error) => res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}` })));
    });

    app.get('/download/:videoId', (req, res) => {
        const transcodeMP3 = req.query.mp3 !== undefined;
        const { videoId } = req.params;

        // Get information on the available video file formats.
        youtube(videoId, transcodeMP3)
            // initiate download response
            .then(data => {
                const { filename, url } = data;
                const outFilename = filename + (transcodeMP3 ? '.mp3' : '');

                // create a downloadable stream
                let stream = download(url, transcodeMP3);

                // transcode it while streaming
                stream = transcodeStream(stream);

                return { stream, outFilename };
            })

            // Send a response
            .then(({ stream, outFilename }) => {
                res.setHeader('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(outFilename));
                res.setHeader('Content-type', 'audio/mpeg');

                stream.pipe(res);
            })
            // Handle errors
            .catch((error) => res.status(500).send(`Something went wrong: ${error.message}`));
    });

    // Download from the AWS S3 Bucket
    app.get('/aws/signed-url/:fileKey', (req, res) => {
        // if GET request
        const fileKey = decodeURIComponent(req.params.fileKey);
        // if POST request
        // const fileKey = req.body.fileKey;
        // if (!fileKey) {
        //     res.status(500).send(JSON.stringify({ error: 'Download key is missing' }));
        //     return;
        // }

        aws_signed_url(fileKey)
            .then(url => {
                // Note - 'url' can be still missing
                res.status(200).send(JSON.stringify({ url }));
            })
            .catch(error => res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}` })));
    });
    
};