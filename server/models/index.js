const mongoose = require("mongoose");

const UserSchema = require("./user.model");
const NoticeSchema = require("./notice.model");
const GroupSchema = require("./group.model");
const ChatSchema = require("./chat.model");
const TravelSchema = require("./travel.model");
const PublicationSchema = require("./publication.model");


module.exports = {
    User: mongoose.model("User", UserSchema),
    Notice: mongoose.model("Notice", NoticeSchema),
    Group: mongoose.model("Group", GroupSchema),
    Chat: mongoose.model("Chat", ChatSchema),
    Travel: mongoose.model("Travel", TravelSchema),
    Publication: mongoose.model("Publication", PublicationSchema)
}
