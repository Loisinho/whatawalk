const mongoose = require("mongoose");

const UserSchema = require("./user.model");
const NoticeSchema = require("./notice.model");
const GroupSchema = require("./group.model");
const ChatSchema = require("./chat.model");


module.exports = {
    User: mongoose.model("User", UserSchema),
    Notice: mongoose.model("Notice", NoticeSchema),
    Group: mongoose.model("Group", GroupSchema),
    Chat: mongoose.model("Chat", ChatSchema)
}
