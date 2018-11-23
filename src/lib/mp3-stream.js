const ffmpeg = require('fluent-ffmpeg');

/**
 * 
 * @param {stream.ReadableStream} input 
 * @return {stream.PassThrough}
 */
module.exports = (input) => {
    // Perform the actual transcoding while streaming
    return ffmpeg(input)
        .format('mp3')
        .audioBitrate(128)
        .stream(); //this will create a pipe-able PassThrough stream
};