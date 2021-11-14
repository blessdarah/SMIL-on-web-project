const express = require('express');
const handlebars = require('express-handlebars');
const sequelize = require('./database');
const path = require('path');
const multer = require('multer');
const upload = multer({
    dest: 'public/images'
});
const app = express();
const SmilController = require('./controllers/SmilController');

const port = process.env.PORT || 8000;

// Parsing middleware
// Parse application/x-www-form
app.use(express.urlencoded({
    extended: false
}));

// Parse application/json
app.use(express.json());


// setup static files
app.use(express.static('public'));

// setup templating engine with handlebars
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, '/views/partials/')
}));
app.set('view engine', 'hbs');

const uploadHandler = upload.fields([{
        name: "imageFileSrc",
        maxCount: 1
    },
    {
        name: "videoFileSrc",
        maxCount: 1
    }
]);
// Setup routing
app.get('/', SmilController.index);
app.get('/home', SmilController.home);
app.post('/create', uploadHandler, SmilController.create);
app.get('/generate', SmilController.generate);


// DB
// sequelize.sync();
sequelize.sync({
    force: true
});

app.listen(port, () => console.log(`Listening on port ${port}`));