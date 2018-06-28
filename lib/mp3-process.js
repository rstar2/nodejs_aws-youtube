const child_process = require('child_process');
const path = require('path');

/**
 * 
 * @param {String} inputFilename 
 * @param {String} mp3Filename 
 * @return {String}
 */
module.exports = (inputFilename, mp3Filename) => {
    // Use the Exodus ffmpeg bundled executable.
    // const ffmpeg = path.resolve(__dirname, 'exodus', 'bin', 'ffmpeg');
    const ffmpeg = process.env.FFMPEG_PATH ||
        process.env.FFMPEG_ROOT ? path.resolve(process.env.FFMPEG_ROOT, 'ffmpeg') : 'ffmpeg';

    // Convert the FLV file to an MP3 file using ffmpeg.
    const ffmpegArgs = [
        '-i', inputFilename,
        '-vn', // Disable the video stream in the output.
        '-acodec', 'libmp3lame', // Use Lame for the mp3 encoding.
        '-ac', '2', // Set 2 audio channels.
        '-q:a', '6', // Set the quality to be roughly 128 kb/s.
        mp3Filename,
    ];
    const child = child_process.spawnSync(ffmpeg, ffmpegArgs);
    return child.stdout.toString() + process.stderr.toString();
};