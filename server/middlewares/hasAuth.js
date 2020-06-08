// Is user logged in?
exports.isLoggedIn = function(req, res, next) {
    // console.log(JSON.stringify(req.session.passport));
    client = req.session.passport? req.session.passport.user : null;
    next();
}

// Has user authoritation?
exports.hasAuth = async function(req, res, next) {
    if (client) {
        next();
    } else
        res.status(401).json("You must be logged in");
}
