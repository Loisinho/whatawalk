const model = require("../../models/");
const bcrypt = require("bcrypt");
const { body, oneOf } = require("express-validator");


exports.signup = [
    body("username", "Invalid username")
        .not().isEmpty()
        .trim()
        .isLength({min: 3})
        .escape()
        .custom(async function (value) {
            let user = await model.User.findOne({ username: value });
            if (user) throw new Error("This username is already in use");
        }),
    body("email", "Invalid email")
        .not().isEmpty()
        .isEmail()
        .normalizeEmail()
        .custom(async function (value) {
            let user = await model.User.findOne({ email: value });
            if (user) throw new Error("This email is already in use");
        }),
    body("password", "Invalid password")
        .not().isEmpty()
        .isLength({min: 6})
];

exports.login = [
    oneOf([
        body("user")
            .not().isEmpty()
            .trim()
            .isLength({min: 3})
            .escape()
            .custom(async function (value) {
                let user = await model.User.findOne({ username: value });
                if (!user) throw new Error("This username does not exist");
            }),
        body("user")
            .not().isEmpty()
            .isEmail()
            .normalizeEmail()
            .custom(async function (value) {
                let user = await model.User.findOne({ email: value });
                if (!user) throw new Error("This email does not exist");
            })
    ], "User does not exist"),
    body("password", "Invalid password")
        .not().isEmpty()
        .isLength({min: 6})
        .custom(async function (value, { req }) {
            let user = await model.User.findOne({$or: [{username: req.body.user}, {email: req.body.user}]}); 
            if (!await bcrypt.compare(value, user.password)) throw new Error("Incorrect password");
        })
];
