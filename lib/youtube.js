const ytdl = require('ytdl-core');

/**
 * 
 * @param {String} videoId 
 * @param {Boolean} transcodeMP3
 * @return {Promise}
 */
module.exports = (videoId, transcodeMP3 = false) => {
    const timestamp = Date.now().toString();

    return ytdl.getInfo(videoId)
        // Choose the best format and construct the Lambda event.
        .then(({ formats, title }) => {
            let format;
            if (transcodeMP3) {
                // We'll just pick the largest audio source file size for simplicity here,
                // you could prioritize things based on bitrate, file format, etc. if you wanted to.
                format = formats
                    .filter(format => format.audioEncoding !== null)
                    .filter(format => format.clen !== null)
                    .sort((a, b) => parseInt(b.clen, 10) - parseInt(a.clen, 10))[0];
            } else {
                format = ytdl.chooseFormat(formats.filter(format => format.container === 'mp4'),
                    { quality: 'highest' });
            }

            return {
                filename: `${title}.${transcodeMP3 ? format.audioEncoding : 'mp4'}`,
                key: `${timestamp} - ${title}`,
                url: format.url,
            };
        });
};