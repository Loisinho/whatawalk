const mongoose = require("mongoose");


const ChatSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    },
    attachment: [String]
});


module.exports = ChatSchema;
