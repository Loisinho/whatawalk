// User Controllers File.
const model = require("../models/");
const { validationResult } = require("express-validator");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const {OAuth2Client} = require('google-auth-library');
const gclient = new OAuth2Client(process.env.GOOGLE_OAUTH_ID);


// GET session.
exports.session = function (req, res, next) {
    res.status(200).json(client);
}

// GET unique field.
exports.exists = async function (req, res, next) {
    try {
        let user = await model.User.findOne({$or: [{username: req.query.username}, {email: req.query.email}]});
        res.status(200).json(user? false : true);
    } catch (error) {
        res.status(422).json("Oops, error verifying email. Please try again.");
    }
}

// POST signup.
exports.signup = async function (req, res, next) {
    try {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let newUser = new model.User({
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
            });
            await newUser.save();
            res.status(200).json("Signed up successfully!");
        } else {
            // let msges = [];
            // errors.array().map(error => msges.push({ [error.param]: error.msg }));
            res.status(422).json("Error verifying your account. " + errors.errors[0].msg);
        }
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
};

// POST login.
exports.login = async function (req, res, next) {
    try {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let user = await model.User.findOne({$or: [{username: req.body.user}, {email: req.body.user}]});
            req.login(user, error => {
                if (error) throw error;
            });
            res.status(200).json("Loged in successfully!");
        } else {
            res.status(422).json(errors.errors[0].msg);
        }
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
};

// POST Signin with Google.
exports.google = async function (req, res, next) {
    try {
        const ticket = await gclient.verifyIdToken({
            idToken: req.body.idtoken
        });
        const payload = ticket.getPayload();
        const useremail = payload['email'];
        let user = await model.User.findOne({email: useremail});
        if (user) {
            req.login(user, error => {
                if (error) throw error;
            });
        }
        res.status(200).json(user? true : false);
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
}

// GET logout.
exports.logout = function (req, res, next) {
    req.session.destroy( error => {
        if (error) res.status(422).end("An error occurred. Please try again.");
        res.end();
    });
}

// GET show profile.
exports.profile = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: req.params.username });
        res.status(200).json({
            username: user.username,
            name: user.name,
            img: user.img,
            ubication: user.ubication,
            description: user.description,
            following: {
                amount: user.following.length,
                status: user.following.includes(client.username)? true: false
            },
            followers: {
                amount: user.followers.length,
                status: user.followers.includes(client.username)? true: false
            }
        });
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST edit profile.
exports.edit = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: client.username });
        user.name = req.body.name;
        user.ubication = req.body.ubication;
        user.description = req.body.description;
        if (req.file !== undefined) {
            if (user.img !== "default_profile.png")
                fs.unlink("./public/images/profile/" + user.img, error => {
                    if (error) throw error;
                });
            user.img = req.file.filename;
        }
        await user.save();
        req.session.passport.user.img = user.img;
        res.status(200).json({img: user.img});
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET search users
exports.search = async function (req, res, next) {
    let user = null;
    let data = [];
    let amount = 2;
    let b = parseInt(req.query.break);
    try {
        switch (req.query.op) {
            case "following":
                user = await model.User.findOne({ username: req.query.id }).select("following");
                let following = user.following.splice(b, amount);
                data = await model.User
                    .find({username: {$in: following}})
                    .select("username img -_id")
                    .lean();
                data.map(i => i.follow = true);
                break;
            case "followers":
                user = await model.User.findOne({ username: req.query.id }).select("following followers");
                let followers = user.followers.splice(b, amount);
                data = await model.User
                    .find({username: {$in: followers}})
                    .select("username img -_id")
                    .lean();
                    data.map(i => i.follow = user.following.includes(i.username)? true: false);
                break;
            default:
                let re = new RegExp(req.query.id, "i");
                user = await model.User.findOne({ username: client.username }).select("following");
                data = await model.User
                    .find({username: re})
                    .sort({username: "asc"})
                    .select("username img -_id")
                    .skip(b)
                    .limit(amount)
                    .lean();
                data.map(i => i.follow = user.following.includes(i.username)? true: false);
                break;
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET follow.
exports.follow = async function (req, res, next) {
    try {
        let userFing = await model.User.findOne({ username: client.username });
        let userFer = await model.User.findOne({ username: req.query.user });
        if (req.query.follow === "1") {
            if (!userFing.following.includes(userFer.username))
                userFing.following.unshift(userFer.username);
            if (!userFer.followers.includes(userFing.username))
                userFer.followers.unshift(userFing.username);
        } else {
            var i = userFing.following.indexOf(userFer.username);
            let j = userFer.followers.indexOf(userFing.username);
            if (i !== -1) userFing.following.splice(i, 1);
            if (j !== -1) userFer.followers.splice(j, 1);
        }
        await userFing.save();
        await userFer.save();
        res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

passport.serializeUser(function(user, done) {
    done(null, {id: user._id, username: user.username, img: user.img});
});
   
passport.deserializeUser(function(user, done) {
    model.User.findById(user.id, function (error, user) {
        done(error, user.username);
    });
});
