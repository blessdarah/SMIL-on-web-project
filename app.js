const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const path = require('path');

const app = express();

const port = process.env.PORT || 8000;

// Parsing middleware
// Parse application/x-www-form
app.use(bodyParser.urlencoded({
    extended: false
}));

// Parse application/json
app.use(bodyParser.json());

// setup static files
app.use(express.static('public'));

// setup templating engine with handlebars
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, '/views/partials/')
}));
app.set('view engine', 'hbs');


// Setup routing
app.get('/', (req, res) => {
    res.render('home');
});


// DB
sequelize.sync();

app.listen(port, () => console.log(`Listening on port ${port}`));