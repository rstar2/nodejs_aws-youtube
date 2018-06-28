const aws_list = require('../../aws/list');

module.exports = (app) => {

    app.get('/list/:folder', (req, res) => {
        const folder = decodeURIComponent(req.params.folder);
        aws_list(folder)
            .then(list => res.render('list', { list }))
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

};

