// Group Controllers File.
const model = require("../models");


// GET find group.
exports.find = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, $or: [{members: {$in: client._id}}, {private: false}]})
            .populate({
                path: "members",
                select: "username img -_id"
            });
        if (group)
            res.status(200).json(group);
        else
            res.status(403).json("You are not allowed to do that...");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST create group.
exports.create = async function (req, res, next) {
    try {
        let newGroup = new model.Group({
            title: req.body.title,
            private: req.body.private,
            admins: [client._id],
            members: [client._id]
        });
        newGroup = (await newGroup.save()).toObject();
        newGroup.members = [{username: client._id, img: client.img}];
        newGroup.member = true;
        newGroup.img = "default_group.jpg";
        res.status(200).json(newGroup);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
};

// GET search groups
exports.search = async function (req, res, next) {
    try {
        let groups = [];
        let limit = 2;
        let skip = parseInt(req.query.break);
        switch (req.query.op) {
            case "member":
                groups = await model.Group
                    .find({members: {$in: client._id}})
                    .sort({updatedAt: "desc"})
                    .select("-chat")
                    .skip(skip)
                    .limit(limit)
                    .populate({
                        path: "members",
                        select: "username img -_id",
                        options: {
                            limit: 5
                        }
                    });
                break;
            default:
                let re = new RegExp(req.query.id, "i");
                groups = await model.Group
                    .find({title: re, private: false})
                    .sort({title: "asc"})
                    .select("-chat")
                    .skip(skip)
                    .limit(limit)
                    .lean();
                groups.map(i => i.members.map(j => j.toString()).includes(client._id)? i.join = false : i.join = true);
                await Promise.all(groups.map(async i => {
                    i.members = await model.User
                        .find({_id: {$in: i.members.splice(0, 5)}})
                        .select("username img -_id");
                }));
                break;
        }
        res.status(200).json(groups);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET search groups where user is admin.
exports.admin = async function (req, res, next) {
    try {
        let guest = await model.User.findOne({username: req.query.guest});
        let groups = await model.Group
            .find({admins: client._id, members: {$nin: guest._id}})
            .sort({updatedAt: "desc"})
            .select("title");
        res.status(200).json(groups);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST invite to group
exports.invite = async function (req, res, next) {
    try {
        let guest = await model.User.findOne({username: req.body.guest});
        let group = await model.Group.findOne({_id: req.body.group, members: {$nin: guest._id}});
        if (group) {
            let newNotice = new model.Notice({
                receiver: guest._id,
                sender: client._id,
                group: group._id
            });
            let notices = await model.Notice.find({receiver: guest._id, group: group._id}).select("group -_id");
            if (!notices.length) {
                newNotice.save();
                res.status(200).json("Invitation done!");
            } else {
                res.status(200).json("This user has already been invited");
            }
        } else {
            res.status(422).json("Oops, an error occurred. Please try again.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET join group
exports.join = async function (req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.query.group, members: {$nin: client._id}});
        if (group) {
            if (!group.private) {
                group.members.push(client._id);
                await group.save();
                res.status(200).json("Ok");
            } else {
                let notice = await model.Notice.findOne({receiver: client._id, group: group._id});
                if (notice) {
                    group.members.push(client._id);
                    await group.save();
                    await model.Notice.findOneAndRemove({_id: notice._id});
                    res.status(200).json("Ok");
                } else {
                    res.status(422).json("Oops, you can not join this group.");
                }
            }
        } else {
            res.status(422).json("Oops, an error occurred. Please try again.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}
