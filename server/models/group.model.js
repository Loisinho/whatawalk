const mongoose = require("mongoose");

const ChatSchema = require("./chat.model");


const GroupSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true,
        max: 40
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
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        accessed: {
            type: Date,
            default: Date.now
        }
    }],
    travel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Travel"
    },
    chat: [ChatSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
{
    // timestamps: true
});


module.exports = GroupSchema;
