const router = require('express').Router();
// import passport set up
// import route controllers
const admin = require('../controllers/admin');

router.get('/', function (req, res) {
  console.log('user is \n', req.user);
  if (!req.user) {
    res.redirect('/accounts/login');
  } else if (!req.user.isStaff) {
    res.redirect('/');
  }
  res.render('admin/admin');
});

router.post('/createPack', admin.createPack);

router.get('/pack/:name', admin.getPack);

router.post('/pack/:name', admin.addQuestion);

module.exports = router;
