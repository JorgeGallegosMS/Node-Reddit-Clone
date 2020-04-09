const express = require('express');

const app = express();

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})