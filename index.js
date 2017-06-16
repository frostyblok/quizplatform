// Module Dependencies
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const messages = require('express-messages');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const uuid = require('uuid');

const dbConfig = require('./config/db');



// database layer
mongoose.connect(dbConfig.database);
const db = mongoose.connection;

db.on('error', function (err) {
  console.bind(err);
});

db.once('open', function () {
  console.log('connected to mongodb');
});

// import User model Object
const User = require('./models/user');


// application layer
const app = express();
const router = express.Router();


// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use(morgan('dev'));

// Body Parser middlewares
// application/json type parser
app.use(bodyParser.json());
// application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// cookieParser middleware
app.use(cookieParser());

// serve static files from '/public'
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: { secure: true }
}));

// Passport init
app. use(passport.initialize());
app.use(passport.session());
require('./config/passport')(app, passport);


// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// set some global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.get('/', function (req, res) {
  res.render('index');
});

const accountRouter = require('./routes/accounts')(app, passport);

// app.use('/accounts', accountRouter);
app.use(app.router);
accountRouter.initialize(app);

app.listen(3000, function () {
  console.log('listening on port 3000!')
});
