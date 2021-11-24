const express = require('express');
const handlebars = require('express-handlebars');
const sequelize = require('./database');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const upload = multer({
    dest: 'public/images'
});
const app = express();
const SmilController = require('./controllers/SmilController');
const MessagesController = require('./controllers/MessagesController');
const SettingsController = require('./controllers/SettingsController');

const port = process.env.PORT || 8000;

// Parsing middleware
// Parse application/x-www-form
app.use(express.urlencoded({
    extended: false
}));

// Parse application/json
app.use(express.json());

app.use(session({
    secret: "smil player app",
    cookie: {}
}));


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
app.get('/home', SmilController.home);
app.post('/smil-messages/:id/delete', SmilController.delete);
app.post('/create', uploadHandler, SmilController.create);
app.get('/generate', SmilController.generate);

// messages
app.get('/messages', MessagesController.index);
app.get('/', MessagesController.index);
app.get('/messages/create', MessagesController.create);
app.post('/messages/store', MessagesController.store);
app.post('/messages/:id/delete', MessagesController.delete);
app.get('/messages/:id/details', MessagesController.details);
app.get('/message/:id/show', MessagesController.show);
app.get('/messages/preview', MessagesController.preview);

app.get('/settings', SettingsController.index);
app.post('/settings', SettingsController.update);


// DB
// sequelize.sync();
sequelize.sync({
    force: true
});

app.listen(port, () => console.log(`Listening on port ${port}`));