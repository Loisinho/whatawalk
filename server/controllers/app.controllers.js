// App Controllers File.
const model = require("../models/");
const { validationResult } = require("express-validator");


// GET test.
exports.test = function (req, res, next) {
    console.log("Hello World!");
    res.status(200).json("Hello World!");
};

// GET unique username.
exports.isUsernameUnique = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: req.params.username });
        res.status(200).json(user? false : true);
    } catch (error) {
        res.status(422).json("Oops, error verifying username. Please try again.");
    }
}

// GET unique email.
exports.isEmailUnique = async function (req, res, next) {
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
                password: req.body.password
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
