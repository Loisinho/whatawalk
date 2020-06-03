// Group Controllers File.
const model = require("../models");


// GET find group.
exports.find = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group})
            .populate({
                path: "members",
                select: "username img",
                options: {
                    sort: {username: "asc"}
                }
            })
            .lean();
        group.members.map(i => i.admin = group.admins.map(j => j.toString()).includes(i._id.toString())? true : false);
        group.admin = group.admins.map(i => i.toString()).includes(client._id)? true : false;
        if (group.members.map(i => i._id.toString()).includes(client._id))
            res.status(200).json(group);
        else
            res.status(403).json("You are not allowed to do that...");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// PATCH modify group admins.
exports.admin = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, admins: {$in: client._id}});
        if (group.members.includes(req.body.member) && req.body.member !== client._id) {
            if (!group.admins.includes(req.body.member)) group.admins.push(req.body.member);
            else group.admins.splice(group.admins.indexOf(req.body.member), 1);
            await group.save();
            res.status(200).json("Ok");
        } else {
            res.status(422).json("Oops, this user can not be modify.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// PATCH remove member from group.
exports.remove = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, admins: {$in: client._id}});
        let adminIndex = group.admins.indexOf(req.body.member);
        let memberIndex = group.members.indexOf(req.body.member);
        if (adminIndex !== -1) {
            if (group.admins.length > 1) {
                group.admins.splice(adminIndex, 1);
                if (memberIndex !== -1)
                    group.members.splice(memberIndex, 1);
                await group.save();
                res.status(200).json("Ok");
            } else {
                res.status(422).json("Oops, this user can not be removed.");
            }
        } else {
            if (memberIndex !== -1) {
                group.members.splice(memberIndex, 1);
                await group.save();
            }
            res.status(200).json("Ok");
        }
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
        let skip = parseInt(req.query.break);
        switch (req.query.op) {
            case "member":
                groups = await model.Group
                    .find({members: {$in: client._id}})
                    .sort({updatedAt: "desc"})
                    .select("-chat")
                    .skip(skip)
                    .limit(parseInt(process.env.LOAD_LIMIT))
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
                    .limit(parseInt(process.env.LOAD_LIMIT))
                    .lean();
                groups.map(i => i.join = i.members.map(j => j.toString()).includes(client._id)? false : true);
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
exports.inviteTo = async function (req, res, next) {
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
        if (group) { // TODO: remove this condition & test it.
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
        if (group) { // TODO: remove this condition & test it.
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
