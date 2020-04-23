const mongoose = require("mongoose");


let UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        max: 30
    },
    email: {
        type: String,
        required: true,
        max: 120
    },
    password: {
        type: String,
        required: true,
        max: 120
    },
    name: {
        type: String,
        required: false,
        max: 50,
        default: ''
    },
    lastname: {
        type: String,
        required: false,
        max: 120,
        default: ''
    }
});


module.exports = UserSchema;
