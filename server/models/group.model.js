const mongoose = require("mongoose");

const ChatSchema = require("./chat.model");


const GroupSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
        max: 40
    },
    date: {
        type: Date,
        required: false,
        default: Date.now
    },
    private: {
        type: Boolean,
        required: false,
        default: false
    },
    img: {
        type: String,
        required: false,
        max: 120,
        default: "default_group.jpg"
    },
    admins: [],
    members: [],
    travel: {
        type: String,
        required: false,
        max: 120,
        default: null
    },
    chat: [ChatSchema]
});


module.exports = GroupSchema;
