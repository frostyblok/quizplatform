const passport = require('passport');
const bcrypt = require('bcryptjs');

// import User model Object
const User = require('../models/user');

// import Institiution model Object
const Institiution = require('../models/institution');

// import Token model Object
const Token = require('../models/token');

// import Serial model Object
const Serial = require('../models/serial');



const getLogin = function (req, res, next) {
  res.render('login');
}

const handleLogin = function (req, res, next) {
  var redirectTo = req.session.redirectTo || '/dashboard';
  delete req.session.redirectTo;
  res.redirect(redirectTo);
}

const logout = function (req, res, next) {
  req.logout();
  req.flash('success', "You are logged out");
  res.redirect('/');
}


const getSignUp = function (req, res, next) {
  Institiution.find({}, function (err, institutions) {
    if (err) console.error(err);
    res.render('signupForm', { institutions });
  })
}

const handleSignUp = function (req, res, next) {
  const email = req.body.email;
  const surName = req.body.surName;
  const firstName = req.body.firstName;
  const username = req.body.username;
  const sex = req.body.sex;
  const institution = req.body.institution;
  const matriculationNumber = req.body.matriculationNumber;
  const telephone = req.body.telephone;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('email', 'A valid email is required').isEmail();
  req.checkBody('surName', 'Please provide your surname').notEmpty();
  req.checkBody('firstName', 'Please provide your first name').notEmpty();
  req.checkBody('sex', 'You have not selected your sex').notEmpty()
  req.checkBody('username', 'Username cannot be empty').notEmpty();
  req.checkBody('institution', 'Please select your institution').notEmpty();
  req.checkBody('matriculationNumber', `Enter your Matriculation/Registration
                number`).notEmpty();
  req.checkBody('telephone', 'Please provide a phone number starting with 234')
               .matches(/234(\d){10}/);
  req.checkBody('password', 'Password cannot be empty').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    Institiution.find({}, function (err, institutions) {
      if (err) console.error(err);
      res.render('signupForm', { institutions, errors });
    })
  } else {
    Institiution.findOne({'institution': institution},
      function (err, institution) {
        if (err) {
          console.log(err);
          return;
        }
        let newUser = new User({email,
                                surName,
                                firstName,
                                username,
                                sex,
                                password,
                                telephone,
                                institution: institution._id,
                                matriculationNumber,
                              });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(newUser.password, salt, function (err, hash) {
            if (err) console.log(err);
            newUser.password = hash;
            newUser.save(function (err) {
              if (err) {
                console.log(err);
                return;
              } else {
                req.flash('success', 'Registration was successful');
                passport.authenticate('local')(req, res, function () {
                  res.redirect('/dashboard');
                })
              }
            })
          })
        })
    });
  }
}


const tokenRegistration = function (req, res) {
  let token = req.body.token;
  req.checkBody('token', 'Please enter a valid 12 digit PIN')
               .matches(/(\d){10}/);
  req.sanitizeBody("token").trim();
  req.sanitizeBody("token").escape();
  const errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    req.flash("error", errors[0].msg)
    res.redirect("/dashboard");
    return;
  }
  Token.findOne({ token }, function (err, token){
    if (err) {
      console.log(err);
      return
    } else {
      console.log("token found");
      User.findByIdAndUpdate(
        { _id: req.user._id },
        { token : token._id },
        function ( err, user) {
          if (err) {
            console.log(err);
          } else {
            console.log(user.token);
            res.end('done');
          }
        }
      )
    }
  })
}

module.exports = {
                  getLogin,
                  handleLogin,
                  logout,
                  getSignUp,
                  handleSignUp,
                  tokenRegistration,
                }
