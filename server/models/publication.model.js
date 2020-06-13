const mongoose = require("mongoose");


const PublicationSchema = new mongoose.Schema ({
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
    img: {
        type: String,
        required: false,
        max: 120
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = PublicationSchema;
