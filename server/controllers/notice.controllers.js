// Notice Controllers File.
const model = require("../models");


// GET search notices
exports.search = async function (req, res, next) {
    try {
        let skip = parseInt(req.query.break);
        let user = await model.User.findOne({_id: client._id}).select("followers");
        let notices = await model.Notice
            .find({receiver: client._id})
            .sort({expireAt: "asc"})
            .skip(skip)
            .limit(parseInt(process.env.LOAD_LIMIT))
            .populate({
                path: "sender",
                select: "username img -_id"
            })
            .populate({
                path: "group",
                select: "title"
            });
        if (user.followers.newest !== 0) {
            notices.unshift(user.followers);
            await user.updateOne({$set: {followers: {newest: 0, users: user.followers.users}}});
        }
        res.status(200).json(notices);
        if (user.followers.newest !== 0) notices.shift();
        await Promise.all(notices.map(async i => {
            i.depopulate("sender group");
            i.seen = true;
            await i.save();
        }));
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// DELETE notice
exports.cancel = async function(req, res, next) {
    try {
        await model.Notice.findOneAndDelete({_id: req.body.notice});
        res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}
