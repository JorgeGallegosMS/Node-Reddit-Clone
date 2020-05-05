require('dotenv').config();

const express = require('express');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const app = express();

let checkAuth = (req, res, next) => {
    console.log("Checking authentication")
    if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
        req.user = null
    } else {
        let token = req.cookies.nToken
        let decodedToken = jwt.decode(token, { complete: true }) || {}
        console.log(decodedToken)
        req.user = decodedToken.payload
    }

    next()
}


app.use(cookieParser())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'))

// Set db
require('./data/reddit-db');
app.use(checkAuth);

app.get('/', (req, res) => {
    res.redirect('/posts/index')
})

app.get('/posts/new', (req, res) => {
    let currentUser = req.user
    res.render('posts-new', { currentUser })
})

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})

module.exports = app;