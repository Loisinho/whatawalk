const mongoose = require("mongoose");


let UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        max: 25
    },
    email: {
        type: String,
        required: true,
        max: 254
    },
    password: {
        type: String,
        required: true,
        max: 120
    },
    name: {
        type: String,
        required: false,
        max: 40,
        default: null
    },
    img: {
        type: String,
        required: false,
        max: 120,
        default: "default_profile.png"
    },
    ubication: {
        type: String,
        required: false,
        max: 40,
        default: null
    },
    description: {
        type: String,
        required: false,
        max: 254,
        default: null
    }
});


module.exports = UserSchema;
