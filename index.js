// Module Dependencies
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const messages = require('express-messages');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const uuid = require('uuid');
const csrf = require('csurf');
const env = process.env.NODE_ENV || 'development';

const { ensureAdmin } = require('./utils/middlewares');
const dbConfig = require('./config/db')[env];


// database layer
if (dbConfig.use_env_variable) {
  mongoose.connect(process.env[dbConfig.use_env_variable]);
} else {
  mongoose.connect(dbConfig.database);
}

const db = mongoose.connection;

db.on('error', function (err) {
  console.log(err);
});

db.once('open', function () {
  console.log('connected to mongodb');
});

// import User model Object
const User = require('./models/user');


// application layer
const app = express();


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
    secret: 'secret', // COrrect this
    saveUninitialized: false,
    resave: false,
}));


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




// Passport init
require('./config/passport')(passport);
app. use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// const csrfProtection = csrf();

// set some global variables making them available in templates
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  res.locals.user = req.user || null;
  next();
});


app.get('/', function (req, res) {
  res.render("index");
});

const accountRouter = require('./routes/accounts');
app.use('/accounts', accountRouter);

const adminRouter = require('./routes/admin');

// app.use('/admin', ensureAdmin, adminRouter);
app.use('/admin', adminRouter);

const siteRouter = require('./routes/site');
app.use('/', siteRouter);


// Handle csrf errors
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403)
  res.send('form tampered with')
})


app.use(function (err, req, res, next) {
  console.error(err.stack);
  let status = 500;
  let message = "Something went wrong";
  res.status(status);
  res.render("error", { status, message });
})

app.use(function (req, res, next) {
  let status = 404;
  let message = "Sorry can't find that!";
  res.status(status);
  res.render("error", { status, message });
})

const port = parseInt(process.env.PORT, 10) || 3000;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
