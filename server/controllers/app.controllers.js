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
        res.status(422).json("An error ocurred: " + error);
    }
}

// GET unique email.
exports.isEmailUnique = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ email: req.params.email });
        res.status(200).json(user? false : true);
    } catch (error) {
        res.status(422).json("An error ocurred: " + error);
    }
}

// POST signup.
exports.signup = async function (req, res, next) {
    try {
        console.log(req.body);
        let errors = validationResult(req);
        console.log(errors);
        if (errors.isEmpty()) {
            let newUser = new model.User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            await newUser.save();
            res.status(200).json("You signed up!");   
        } else {
            let msges = [];
            errors.array().map(error => msges.push({ [error.param]: error.msg }));
            res.status(422).json({ errors: msges });
        }
    } catch (error) {
        res.status(422).json("An error ocurred: " + error);
    }
};
