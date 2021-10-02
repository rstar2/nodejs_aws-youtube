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
        .then(data => {
            const { formats, videoDetails } = data;
            const { title } = videoDetails;
            let format;
            if (transcodeMP3) {
                //  just pick the highest quality audio
                format = ytdl.chooseFormat(formats, {quality: 'highestaudio'});
                // could prioritize things based on bitrate, file format if needed
                // format = formats
                //     .filter(format => !!format.audioCodec && !!format.audioBitrate)
                //     .sort((a, b) => parseInt(b.audioBitrate, 10) - parseInt(a.audioBitrate, 10))
                //     [0];
            } else {
                format = ytdl.chooseFormat(formats.filter(format => format.container === 'mp4'),
                    { quality: 'highest' });
            }

            return {
                filename: `${title}.${transcodeMP3 ? format.audioCodec : 'mp4'}`,
                key: `${timestamp} - ${title}`,
                url: format.url,
            };
        });
};