const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');


module.exports = function (passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  //  Configure Passport authentication
  passport.use('local', new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) throw error;
          if (isMatch) {
            return done(null,
              user,
              { message: `Welcome ${user.firstName || user.username}`});
          } else {
            return done(
              null,
              false,
              { message: "Incorrect Username or password" }
            );
          }
        })
      });
    })
  );
}
