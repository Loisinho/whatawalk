const mongoose = require("mongoose");


const ChatSchema = new mongoose.Schema ({
    user: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        max: 254
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = ChatSchema;
