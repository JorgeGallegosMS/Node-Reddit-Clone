const express = require('express');

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Set db
require('./data/reddit-db');
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);

app.get('/', (req, res) => {
    res.redirect('/posts/index')
})

app.get('/posts/new', (req, res) => {
    res.render('posts-new')
})


app.listen(3000, () => {
    console.log('Listening on port 3000');
})

module.exports = app;