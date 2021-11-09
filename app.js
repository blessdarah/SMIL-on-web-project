const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const path = require('path');
const multer = require('multer');
const upload = multer();
const app = express();
const SmilController = require('./controllers/SmilController');

const port = process.env.PORT || 8000;

// Parsing middleware
// Parse application/x-www-form
app.use(bodyParser.urlencoded({
    extended: false
}));

// Parse application/json
app.use(bodyParser.json());
app.use(upload.array('imageFileSrc'));

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
app.get('/', SmilController.index);
app.get('/home', SmilController.home);
app.post('/create', SmilController.create);
app.get('/generate', SmilController.generate);


// DB
sequelize.sync();

app.listen(port, () => console.log(`Listening on port ${port}`));