const model = require("../../models/");
const bcrypt = require("bcrypt");
const { body, oneOf } = require("express-validator");


exports.signup = [
    body("email", "Invalid email")
        .not().isEmpty()
        .isEmail()
        .normalizeEmail()
        .isLength({max: 254})
        .custom(async function (value) {
            let user = await model.User.findOne({ email: value });
            if (user) throw new Error("This email is already in use");
        }),
    body("username", "Invalid username")
        .not().isEmpty()
        .trim()
        .isLength({min: 3, max: 25})
        .escape()
        .custom(async function (value) {
            let user = await model.User.findOne({ username: value });
            if (user) throw new Error("This username is already in use");
        }),
    body("password", "Invalid password")
        .not().isEmpty()
        .isLength({min: 6, max: 120})
];

exports.login = [
    oneOf([
        body("user").custom(async function (value) {
            let user = await model.User.findOne({ username: value });
            if (!user) throw new Error("This username does not exist");
        }),
        body("user").custom(async function (value) {
            let user = await model.User.findOne({ email: value });
            if (!user) throw new Error("This email does not exist");
        })
    ], "User does not exist"),
    body("password", "Invalid password").custom(async function (value, { req }) {
        let user = await model.User.findOne({$or: [{username: req.body.user}, {email: req.body.user}]}); 
        if (!await bcrypt.compare(value, user.password)) throw new Error("Incorrect password");
    })
];

exports.reset = [
    body("password", "Invalid password")
        .not().isEmpty()
        .isLength({min: 6, max: 120})
];
