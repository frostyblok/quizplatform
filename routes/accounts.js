const router = require('express').Router();
const passport = require('passport');

// import route controllers
const accounts = require('../controllers/accounts');


router.get('/login', accounts.getLogin);

router.post('/login',
            passport.authenticate(
              'local',
              {
                failureRedirect: '/',
                failureFlash: true,
                successFlash: true,
              }
            ),
            accounts.handleLogin
           );

router.get('/logout', accounts.logout);

router.get('/sign-up', accounts.getSignUp);

router.post('/sign-up', accounts.handleSignUp);

// router.post('/token-auth', accounts.tokenRegistration);

module.exports = router;
