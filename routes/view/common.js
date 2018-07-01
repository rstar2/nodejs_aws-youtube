module.exports = (app) => {

    app.get('/download/:videoId', (req, res) => {
        const videoId = req.params.videoId;
        // Render the download page template.
        res.render('download', { videoId });
    });

};