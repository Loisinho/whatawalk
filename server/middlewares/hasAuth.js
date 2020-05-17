// Is user logged in?
exports.isLoggedIn = function(req, res, next) {
    // console.log(JSON.stringify(req.session.passport));
    user = req.session.passport? req.session.passport.user : null;
    next();
}

// Has user authoritation?
exports.hasAuth = function(req, res, next) {
    user = req.session.passport? req.session.passport.user : null;
    if (user)
        next();
    else
        res.status(401).json("You must be logged in");
}
