// Group Controllers File.
const model = require("../models");


// POST create group.
exports.create = async function (req, res, next) {
    try {
        let newGroup = new model.Group({
            title: req.body.title,
            private: req.body.private,
            admins: [client.username],
            members: [client.username]
        });
        user = await model.User.findOne({ username: client.username });
        user.groups.push(newGroup._id);
        await newGroup.save();
        await user.save();
        newGroup.members = [{username: client.username, img: client.img}];
        newGroup.member = true;
        newGroup.img = "default_group.jpg";
        res.status(200).json(newGroup);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
};

// TODO: POST invite to group
exports.invite = async function (req, res, next) {
    console.log("Invitation done!");
    res.status(200).json("Invitation done!");
}

// GET search groups
exports.search = async function (req, res, next) {
    let user = null;
    let groups = [];
    let amount = 2;
    let b = parseInt(req.query.break);
    try {
        switch (req.query.op) {
            case "member":
                if (client.username === req.query.id) {
                    user = await model.User.findOne({ username: client.username }).select("groups");
                    groups = await model.Group
                        .find({ _id: user.groups })
                        .sort({date: "desc"})
                        .select("-chat")
                        .skip(b)
                        .limit(amount)
                        .lean();
                } else {
                    res.status(403).json("You are not allowed to do that...");
                }
                break;
            default:
                let re = new RegExp(req.query.id, "i");
                user = await model.User.findOne({ username: client.username }).select("groups");
                groups = await model.Group
                    .find({title: re, private: false})
                    .sort({title: "asc"})
                    .select("-chat")
                    .skip(b)
                    .limit(amount)
                    .lean();
                groups.map(i => user.groups.includes(i._id)? i : i.join = true);
                break;
        }
        await Promise.all(groups.map(async i => {
            i.members = await model.User
                .find({username: {$in: i.members.splice(0, 5)}})
                .select("username img -_id");
        }));
        res.status(200).json(groups);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET join group
exports.join = async function (req, res, next) {
    try {
        let group = await model.Group.findOne({ _id: req.query.group });
        if (!group.private && !group.members.includes(client.username)) {
            let user = await model.User.findOne({ username: client.username }).select("groups");
            group.members.push(client.username);
            user.groups.unshift(group._id);
            await group.save();
            await user.save();
            res.status(200).json("Ok");
        }
        res.status(422).json("Oops, you can not join this group.");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}
