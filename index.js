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
}));

// Passport init
require('./config/passport')(passport);
app. use(passport.initialize());
app.use(passport.session());


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
  res.locals.messages = messages(req, res);
  res.locals.user = req.user || null;
  next();
});


app.get('/', function (req, res) {
  if (!req.user)
    req.flash("success", "Welcome Great Scholar")
  res.render("index");
});

const accountRouter = require('./routes/accounts');
app.use('/accounts', accountRouter);

const adminRouter = require('./routes/admin');

// admin authorization middleware
app.use('/admin', function(req, res, next) {
  if(!req.user) {
    res.status(401);
    res.redirect('/accounts/login');
  } else if (!req.user.isStaff) {
    res.status(403);
    res.redirect('/');
  }
  next();
})
app.use('/admin', adminRouter);


app.listen(3000, function () {
  console.log('listening on port 3000!')
});
