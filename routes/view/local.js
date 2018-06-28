module.exports = (app) => {

    app.get('/list/:type', (req, res) => {
        const type = decodeURIComponent(req.params.type);
        res.render('list', { type, list: ['key1', 'key2'] });
    });

};

