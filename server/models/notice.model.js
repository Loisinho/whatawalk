const mongoose = require("mongoose");


const NoticeSchema = new mongoose.Schema ({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true,
    },
    seen: {
        type: Boolean,
        required: false,
        default: false
    },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24*7
    }
});


module.exports = NoticeSchema;
