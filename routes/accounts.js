const router = require('express').Router();
// import passport set up
// import route controllers
const accounts = require('../controllers/accounts');

router.get('/login', accounts.getLogin);

router.post('/login', accounts.handleLogin);

router.get('/logout', accounts.logout);

router.get('/sign-up', accounts.getSignUp);

router.post('/sign-up', accounts.handleSignUp);

module.exports = router;
