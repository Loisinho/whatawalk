const mongoose = require("mongoose");


const TokenSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24
    }
});


module.exports = TokenSchema;
