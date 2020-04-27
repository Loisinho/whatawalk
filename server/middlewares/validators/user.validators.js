const model = require("../../models/");

const { body } = require("express-validator");


exports.signup = [
    body("username", "Username does not exists").exists().trim().escape().custom(async function (value) {
        let user = await model.User.findOne({ username: value });
        if (user) throw new Error("This username is already in use");
    }),
    body("email", "Invalid email").exists().isEmail().normalizeEmail().custom(async function (value) {
        let user = await model.User.findOne({ email: value });
        if (user) throw new Error("This email is already in use");
    }),
    body("password", "Invalid password").exists().isLength({min: 6})
];
