const Token = require("../models/token");

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
    req.flash("message", "Login to proceed");
    res.status(401);
    res.redirect('/');
  } else {
    next();
  }
}

function isRegistered (req, res, next) {
  if(!req.user.isRegistered) {
    req.session["redirectTo"] = req.url;
    req.flash(
      "failure",
      "You need to complete your registration to in order to compete"
    );
    res.redirect('/dashboard');
  } else {
    next();
  }
}

function checkToken (req, res, next) {
  req.session["redirectTo"] = req.url;
  if (req.session.quizReady) {
    next();
  } else {
    res.redirect("/quiz-auth");
  }
}


module.exports = {
  ensureAdmin,
  ensureLogin,
  checkToken,
  isRegistered,
};
