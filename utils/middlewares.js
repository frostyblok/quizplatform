const authRestrict = function(req, res, next){
    if ( !req.session.user ) {
      console.log(req.url);
        req.session.redirectTo = req.url;
            res.redirect('/accounts/login');
    } else {
        next();
    }
};


module.exports = {
  authRestrict,
};
