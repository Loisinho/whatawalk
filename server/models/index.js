const mongoose = require("mongoose");

const UserSchema = require("./user.model");
const GroupSchema = require("./group.model");
const ChatSchema = require("./chat.model");


module.exports = {
    User: mongoose.model("user", UserSchema),
    Group: mongoose.model("group", GroupSchema),
    Chat: mongoose.model("chat", ChatSchema)
}
