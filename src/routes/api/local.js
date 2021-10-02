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

                // https://r1---sn-uxaxovgcbg-nv4e.googlevideo.com/videoplayback?expire=1633223941&ei=pbBYYezpF4m9gAfqnaLAAw&ip=149.62.202.156&id=o-AE6kzpURXKADGR-BL_3zGoumz7IsUS6SuXr5j76RZhQW&itag=18&source=youtube&requiressl=yes&mh=wm&mm=31%2C29&mn=sn-uxaxovgcbg-nv4e%2Csn-nv47lnly&ms=au%2Crdu&mv=m&mvi=1&pl=24&initcwndbps=502500&vprv=1&mime=video%2Fmp4&ns=uWgkcf752wb7BIqrW9Aqay8G&gir=yes&clen=5035969&ratebypass=yes&dur=109.621&lmt=1600707425433945&mt=1633201730&fvip=1&fexp=24001373%2C24007246&c=WEB&txp=6210222&n=fCXbrVeduY2avd0Z&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRQIgcktZIiC8Q4Lf0Ltz0pAifIqGCwZLv8cvwHTspTYmcbYCIQCsWXLKW4tZYr2F19Uq6fAc9YA1L4i8BiL1LnGGAEM2bQ%3D%3D&sig=AOq0QJ8wRQIgHzXo6WwtxkFcQu_9krs9D3u5wl6I8M24Rc39Ayxik_YCIQD9GHmIa-kkOvqS2uEXY4FZwJTwJosXOV7r7X9WLmOI9Q%3D%3D
                // create a downloadable stream
                let stream = download(url, transcodeMP3);

                if (transcodeMP3) {
                    // transcode it while streaming
                    stream = transcodeStream(stream);
                }

                return { stream, outFilename };
            })

            // Send a response
            .then(({ stream, outFilename }) => {
                res.setHeader('Content-Disposition', 'attachment; filename*=UTF-8\'\'' + encodeURIComponent(outFilename));
                res.setHeader('Content-type', transcodeMP3 ? 'audio/mpeg' : 'video/mp4');

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