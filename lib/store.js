const fs = require('fs');
const request = require('request');

/**
 * 
 * @param {String} url 
 * @param {String} filename 
 * @return {Promise}
 */
module.exports = (url, filename) => {
    // Download the source file.
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filename);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        request(url).pipe(writeStream);
    });
};