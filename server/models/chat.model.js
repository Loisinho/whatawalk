const mongoose = require("mongoose");


const ChatSchema = new mongoose.Schema ({
    user: {
        type: String,
        required: true,
        max: 40
    },
    text: {
        type: String,
        required: true,
        max: 254
    },
    date: {
        type: Date,
        required: false,
        default: Date.now
    },
    attachment: []
});


module.exports = ChatSchema;
