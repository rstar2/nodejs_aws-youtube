module.exports = (app) => {

    app.get('/', (req, res) => {
        // Render the download page template.
        res.render('home');
    });
    
};