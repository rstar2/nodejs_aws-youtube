module.exports = (app) => {
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