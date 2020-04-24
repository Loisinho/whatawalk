const model = require("../../models/");

const { body } = require("express-validator");


exports.signup = [
    body("username", "Username does not exists").exists(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().isLength({min: 8})
];
