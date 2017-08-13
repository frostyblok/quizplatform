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
  req.flash("message", "Login to proceed")
  res.redirect('/')
}

const handleLogin = function (req, res, next) {
  const redirectTo = req.session.redirectTo || '/dashboard';
  delete req.session.redirectTo;
  res.redirect(redirectTo);
}

const logout = function (req, res) {
  delete req.session.redirectTo;
  req.flash('success', "You are logged out");
  req.logout();
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
               .matches(/^234[0-9]{10}$/);
  req.checkBody('password', 'Password cannot be empty').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  req.sanitizeBody('email').trim();
  req.sanitizeBody('email').escape();
  req.sanitizeBody('surName').trim();
  req.sanitizeBody('surName').escape();
  req.sanitizeBody('firstName').trim();
  req.sanitizeBody('firstName').escape();
  req.sanitizeBody('sex').trim();
  req.sanitizeBody('sex').escape();
  req.sanitizeBody('username').trim();
  req.sanitizeBody('username').escape();
  req.sanitizeBody('institution').trim();
  req.sanitizeBody('institution').escape();
  req.sanitizeBody('matriculationNumber').trim();
  req.sanitizeBody('matriculationNumber').escape();
  req.sanitizeBody('telephone').trim();
  req.sanitizeBody('telephone').escape();
  req.sanitizeBody('password').escape();

  let errors = req.validationErrors();

  if (errors) {
    let details = {
      email,
      surName,
      firstName,
      sex,
      username,
      institution,
      matriculationNumber,
      telephone,
    }
    Institiution.find({}, function (err, institutions) {
      if (err) console.error(err);
      res.render('signupForm', { institutions, errors, details });
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
            if (err) {
              throw err;
            }
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


module.exports = {
                  getLogin,
                  handleLogin,
                  logout,
                  getSignUp,
                  handleSignUp,
                }
