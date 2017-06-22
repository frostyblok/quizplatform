const passport = require('passport');
const bcrypt = require('bcryptjs');

// import User model Object
const User = require('../models/user');

// import Institiution model Object
const Institiution = require('../models/institution');

const getLogin = function (req, res, next) {
  res.render('login');
}

const handleLogin = function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/accounts/login',
    failureFlash: true,
    successFlash: true,
  })(req, res, next);
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
  const surname = req.body.surname;
  const firstName = req.body.firstName;
  const username = req.body.username;
  const sex = req.body.sex;
  const institution = req.body.institution;
  const matriculationNumber = req.body.matriculationNumber;
  const telephone = req.body.telephone;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('email', 'A valid email is required').isEmail();
  req.checkBody('surname', 'Please provide your surname').notEmpty();
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
                                surname,
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
                res.redirect('/accounts/login');
              }
            })
          })
        })
    });
  }
}


module.exports = { getLogin, handleLogin, logout, getSignUp, handleSignUp }
