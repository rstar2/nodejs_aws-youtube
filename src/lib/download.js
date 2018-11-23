const request = require('request');

/**
 * 
 * @param {String} url 
 * @return {stream.PassThrough}
 */
module.exports = (url) => request(url);