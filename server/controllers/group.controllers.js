// Group Controllers File.
const model = require("../models");
const fs = require("fs");


// GET find group.
exports.find = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, "members.user": {$in: client._id}})
            .populate({
                path: "members.user",
                select: "username img",
            })
            .populate({
                path: "travel"
            })
            .lean();
        group.members.map(i => i.admin = group.admins.map(j => j.toString()).includes(i.user._id.toString())? true : false);
        group.admin = group.admins.map(i => i.toString()).includes(client._id)? true : false;
        res.status(200).json(group);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST edit group.
exports.edit = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, admins: client._id});
        group.title = req.body.title;
        if (req.body.travel === "null") {
            await model.Travel.findOneAndRemove({_id: group.travel});
            group.travel = undefined;
        }
        group.private = req.body.private;
        if (req.file !== undefined) {
            if (group.img !== "default_group.jpg")
                fs.unlink("./public/images/group/" + group.img, error => {
                    if (error) throw error;
                });
            group.img = req.file.filename;
        }
        let text = client.username + " edited the group";
        let newMsg = new model.Chat({
            user: client.username,
            text: text,
            general: true
        });
        group.chat.push(newMsg);
        group.updatedAt = newMsg.date;
        await group.save();
        res.status(200).json({img: group.img, text: text});
    } catch (error) {
        if (req.file) fs.unlink("./public/images/group/" + req.file.filename, error => {});
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// DELETE delete group.
exports.delete = async function(req, res, next) {
    try {
        let group = await model.Group.findOneAndDelete({_id: req.params.group, admins: client._id})
            .select("img members")
            .populate({
                path: "members.user",
                select: "username -_id",
            });
        await model.Travel.findOneAndDelete({_id: group.travel});
        if (group.img !== "default_group.jpg")
            fs.unlink("./public/images/group/" + group.img, error => {
                if (error) throw error;
            });
        res.status(200).json(group.members);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// PATCH modify group admins.
exports.admin = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, admins: {$in: client._id}});
        if (group.members.map(i => i.user.toString()).includes(req.body.member) && req.body.member !== client._id) {
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

// PATCH remove user from group.
exports.remove = async function(req, res, next) {
    try {
        if (req.body.member) {
            var group = await model.Group.findOne({_id: req.params.group, admins: {$in: client._id}});
            var adminIndex = group.admins.indexOf(req.body.member.id);
            var memberIndex = group.members.map(i => i.user.toString()).indexOf(req.body.member.id);
            var text = client.username + " removed " + req.body.member.username;
        } else {
            var group = await model.Group.findOne({_id: req.params.group, "members.user": {$in: client._id}});
            var adminIndex = group.admins.indexOf(client._id);
            var memberIndex = group.members.map(i => i.user.toString()).indexOf(client._id);
            var text = client.username + " left the group.";
        }
        if (adminIndex !== -1) {
            if (group.admins.length > 1) {
                group.admins.splice(adminIndex, 1);
                if (memberIndex !== -1)
                    group.members.splice(memberIndex, 1);
                let newMsg = new model.Chat({
                    user: client.username,
                    text: text,
                    general: true
                });
                group.chat.push(newMsg);
                group.updatedAt = newMsg.date;
                await group.save();
                res.status(200).json(text);
            } else {
                res.status(422).json("Oops, this user can not be removed.");
            }
        } else if (memberIndex !== -1) {
            group.members.splice(memberIndex, 1);
            let newMsg = new model.Chat({
                user: client.username,
                text: text,
                general: true
            });
            group.chat.push(newMsg);
            group.updatedAt = newMsg.date;
            await group.save();
            res.status(200).json(text);
        } else {
            res.status(422).json("Oops, something bad happened.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// PATCH new group msg.
exports.msg = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, "members.user": {$in: client._id}});
        if (req.body.text) {
            let newMsg = new model.Chat({
                user: client.username,
                text: req.body.text
            });
            group.chat.push(newMsg);
            group.updatedAt = newMsg.date;
            await group.save();
        }
        res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET group accessed.
exports.accessed = async function (req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.params.group, "members.user": {$in: client._id}});
        group.members.map(i => { if (i.user.toString() === client._id) i.accessed = Date.now(); });
        await group.save();
        res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred.");
    }
}

// POST create group.
exports.create = async function (req, res, next) {
    try {
        let newGroup = new model.Group({
            title: req.body.title,
            private: req.body.private,
            admins: [client._id],
            members: [{user: client._id}]
        });
        newGroup = (await newGroup.save()).toObject();
        newGroup.members[0].user = {username: client._id, img: client.img};
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
                    .find({"members.user": {$in: client._id}})
                    .sort({updatedAt: "desc"})
                    .select("-chat")
                    .skip(skip)
                    .limit(parseInt(process.env.LOAD_LIMIT))
                    .populate({
                        path: "members.user",
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
                groups.map(i => i.join = i.members.map(j => j.user.toString()).includes(client._id)? false : true);
                await Promise.all(groups.map(async i => {
                    await Promise.all(i.members.slice(0, 5).map(async j => {
                        j.user = await model.User
                            .findOne({_id: j.user})
                            .select("username img -_id");
                    }));
                }));
                break;
        }
        res.status(200).json(groups);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET search groups where user is admin.
exports.groupAdmin = async function (req, res, next) {
    try {
        let groups = [];
        if (req.query.guest && req.query.guest !== "undefined") {
            let guest = await model.User.findOne({username: req.query.guest});
            groups = await model.Group
                .find({admins: client._id, "members.user": {$nin: guest._id}})
                .sort({updatedAt: "desc"})
                .select("title");
        } else {
            groups = await model.Group
                .find({admins: client._id})
                .sort({updatedAt: "desc"})
                .select("title");
        }
        res.status(200).json(groups);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST invite to group
exports.invite = async function (req, res, next) {
    try {
        let guest = await model.User.findOne({username: req.body.guest});
        let group = await model.Group.findOne({_id: req.body.group, admins: client._id, "members.user": {$nin: guest._id}});
        if (group.members.length < 64) {
            let notices = await model.Notice.find({receiver: guest._id, group: group._id}).select("group -_id");
            if (!notices.length) {
                let newNotice = new model.Notice({
                    receiver: guest._id,
                    sender: client._id,
                    group: group._id
                });
                newNotice.save();
                res.status(200).json("Invitation done!");
            } else {
                res.status(200).json("This user has already been invited");
            }
        } else {
            res.status(200).json("This group is complete");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET join group
exports.join = async function (req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.query.group, "members.user": {$nin: client._id}});
        let notice = await model.Notice.findOne({receiver: client._id, group: group._id});
        if (group.members.length < 64) {
            let text = client.username + " joined the group";
            if (!group.private && !notice) {
                group.members.push({user: client._id});
                let newMsg = new model.Chat({
                    user: client.username,
                    text: text,
                    general: true
                });
                group.chat.push(newMsg);
                group.updatedAt = newMsg.date;
                await group.save();
                res.status(200).json(text);
            } else if (notice) {
                group.members.push({user: client._id});
                let newMsg = new model.Chat({
                    user: client.username,
                    text: text,
                    general: true
                });
                group.chat.push(newMsg);
                group.updatedAt = newMsg.date;
                await group.save();
                await model.Notice.findOneAndRemove({_id: notice._id});
                res.status(200).json(text);
            } else {
                res.status(422).json("Oops, you can not join this group.");
            }
        } else {
            res.status(422).json("This group is complete");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST Save travel in group.
exports.travel = async function(req, res, next) {
    try {
        let group = await model.Group.findOne({_id: req.body.group, admins: client._id});
        let newTravel = new model.Travel({
            location: req.body.location,
            itinerary: req.body.list
        });
        group.travel = newTravel._id;
        await newTravel.save();
        await group.save();
		res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}
