module.exports = (app) => {

    // TODO: move to aws only - currently just for testing
    app.get('/download/:videoId', (req, res) => {
        const videoId = req.params.videoId;
        // Render the download page template.
        res.render('download', { videoId });
    });

};