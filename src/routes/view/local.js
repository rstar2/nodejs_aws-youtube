const aws_list = require('../../aws/list');

module.exports = (app) => {

    // List the AWS S3 Bucket
    app.get('/aws/list/:folder', (req, res) => {
        const folder = req.params.folder;
        aws_list(folder)
            .then(list => {
                res.render('list', { folder, list});
            })
            .catch(error => res.status(500).send(`Something went wrong: ${error.message}`));
    });

};

