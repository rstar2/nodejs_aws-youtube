const aws_list = require('../../aws/list');

module.exports = (app) => {

    app.get('/list/:folder', (req, res) => {
        const folder = req.params.folder;
        aws_list(folder)
            .then(list => res.render('list', { folder, list }))
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

    app.get('/download/:video', (req, res) => {
        let videoId = decodeURIComponent(req.params.video);

        // if videoId is actually the whole videoUrl,
        // like http://www.youtube.com/watch?v=videoId&y=xxxxxx
        if (videoId.includes('youtube.com')) {
            videoId = videoId.match(/v=([^&]*)/)[1];
        }

        if (!videoId) {
            res.status(500).send('Cannot get valid video id to transcode');
        } else {
            res.render('download', { videoId });
        }
    });

};

