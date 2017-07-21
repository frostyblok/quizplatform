function ensureAdmin (req, res, next) {
  if(!req.user) {
    req.session['redirectTo'] = '/admin' + req.url;
    res.status(401);
    res.redirect('/accounts/login');
  } else if (!req.user.isStaff) {
    res.status(403);
    res.redirect('/');
  } else {
    next();
  }
}

function ensureLogin (req, res, next) {
  if(!req.user) {
    req.session["redirectTo"] = req.url;
    res.status(401);
    res.redirect('/accounts/login');
  } else {
    next();
  }
}

function isRegistered (req, res, next) {
  if(!req.user.isRegistered) {
    req.session["redirectTo"] = req.url;
    res.redirect('/dashboard');
  } else {
    next();
  }
}

function checkToken (req, res, next) {
  if(!req.user.token) {
    req.session["redirectTo"] = req.url;
    res.redirect('/quiz-auth');
  } else { // handle Invalid tokens here. Or delete token if Invalid elsewhere
    next();
  }
}

module.exports = {
  ensureAdmin,
  ensureLogin,
  checkToken,
  isRegistered,
};
