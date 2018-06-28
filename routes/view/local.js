module.exports = (app) => {

    app.get('/list/:folder', (req, res) => {
        const folder = decodeURIComponent(req.params.folder);
        res.render('list', { list: [folder, 'key1', 'key2'] });
    });

};

