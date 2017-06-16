module.exports = function (app, passport) {
  // import passport set up
  require('../config/passport')(app, passport);
  // import route controllers
  const accounts = require('../controllers/accounts')(app, passport);
  app.get('/login', accounts.getLogin);

  app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/accounts/login',
        failureFlash: true,
    })
  );

  app.get('/logout', accounts.logout);

  app.get('/sign-up', accounts.getSignUp);

  app.post('/sign-up', accounts.handleSignUp);
}
