// App Controllers File.
const model = require("../models/");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");


// GET session.
exports.session = function (req, res, next) {
    res.status(200).json(user);
}

// GET unique username.
exports.usernameExists = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: req.params.username });
        res.status(200).json(user? false : true);
    } catch (error) {
        res.status(422).json("Oops, error verifying username. Please try again.");
    }
}

// GET unique email.
exports.emailExists = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ email: req.params.email });
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
                username: req.body.username,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
            });
            await newUser.save();
            res.status(200).json("ok");
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
            req.session.user = {
                username: user.username,
                img: user.img
            };
            res.status(200).json("Loged in successfully!");
        } else {
            res.status(422).json(errors.errors[0].msg);
        }
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
};

// GET logout.
exports.logout = function (req, res, next) {
    req.session.destroy( error => {
        if (error) res.status(422).end("An error occurred. Please try again.");
        res.end();
    });
}

// GET profile.
exports.profile = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: req.params.username });
        res.status(200).json({
            username: user.username,
            name: user.name,
            img: user.img,
            ubication: user.ubication,
            description: user.description,
            following: "10K",
            followers: "999M",
        });
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST edit profile.
exports.edit = async function (req, res, next) {
    if (user.username === req.params.username) {
        try {
            let user = await model.User.findOne({ username: req.params.username });
            user.name = req.body.name;
            user.ubication = req.body.ubication;
            user.description = req.body.description;
            if(req.file !== undefined) {
                user.img = req.file.filename;
            }
            await user.save();
            req.session.user.img = user.img;
            res.status(200).json({img: user.img});
        } catch (error) {
            res.status(422).json("Oops, an error occurred. Please try again.");
        }
    }
}

// GET test.
exports.test = function (req, res, next) {
    res.status(200).json("Hello World!");
};
