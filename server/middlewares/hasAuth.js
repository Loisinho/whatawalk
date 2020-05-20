// Is user logged in?
exports.isLoggedIn = function(req, res, next) {
    // console.log(JSON.stringify(req.session.passport));
    client = req.session.passport? req.session.passport.user : null;
    next();
}

// Has user authoritation?
exports.hasAuth = function(req, res, next) {
    client = req.session.passport? req.session.passport.user : null;
    if (client)
        next();
    else
        res.status(401).json("You must be logged in");
}

// Is user allowed?
exports.isAllowed = function(req, res, next) {
    if (client.username === req.params.username)
        next();
    else
        res.status(403).json("You are not allowed to do that...");
}
