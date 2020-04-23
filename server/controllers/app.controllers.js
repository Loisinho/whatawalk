// App Controllers File.
const model = require("../models/");

// GET test.
exports.test = function (req, res, next) {
    console.log("Hello World!");
    res.status(200).json("Hello World!");
};

// POST signup.
exports.signup = async function (req, res, next) {
    try {
        console.log(req.body);
        let newUser = new model.User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        await newUser.save();
        res.status(200).json("You signed up!");
    } catch (error) {
        res.status(422).json("Error ocurred..");
    }
};
