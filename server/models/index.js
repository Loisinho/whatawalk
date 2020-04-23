const mongoose = require("mongoose");

let UserSchema = require("./user.model");


module.exports = {
    User: mongoose.model("user", UserSchema)
}
