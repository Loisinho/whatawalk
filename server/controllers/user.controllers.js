// User Controllers File.
const model = require("../models/");
const { validationResult } = require("express-validator");
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");
const {OAuth2Client} = require('google-auth-library');
const gclient = new OAuth2Client(process.env.GOOGLE_OAUTH_ID);
const nodemailer = require('nodemailer');

// NOTE: Configure nodemailer options.
const nodemailerOptions = {
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
}
const transporter = nodemailer.createTransport(nodemailerOptions);


// GET session.
exports.session = async function (req, res, next) {
    try {
        if (client) {
            let notices = await model.Notice.find({receiver: client._id, seen: false});
            client.notices = !!notices.length;
            let groups = await model.Group.find({"members.user": {$in: client._id}}).select("members chat");
            client.groups = [];
            groups.map(i => {
                let lastMsg = i.chat[i.chat.length - 1];
                let clientIndex = i.members.map(j => j.user.toString()).indexOf(client._id);
                let notify = lastMsg? i.members[clientIndex].accessed < lastMsg.date : false;
                client.groups.push({
                    group: i._id,
                    notify: notify
                });
            });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(200).json(null);
    }
}

// GET unique field.
exports.exists = async function (req, res, next) {
    try {
        let user = await model.User.findOne({$or: [{username: req.query.username}, {email: req.query.email}]});
        res.status(200).json(user? false : true);
    } catch (error) {
        res.status(422).json("Oops, error verifying account. Please try again.");
    }
}

// POST signup.
exports.signup = async function (req, res, next) {
    try {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let newUser = new model.User({
                email: req.body.email,
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10))
            });
            await newUser.save();
            res.status(200).json("Signed up successfully!");
        } else {
            // let msges = [];
            // errors.array().map(error => msges.push({ [error.param]: error.msg }));
            res.status(422).json("Error verifying your account. " + errors.errors[0].msg);
        }
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
};

// POST login.
exports.login = async function (req, res, next) {
    try {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            let user = await model.User.findOne({$or: [{username: req.body.user}, {email: req.body.user}]});
            req.login(user, error => {
                if (error) throw error;
            });
            res.status(200).json(await sessionData(user));
        } else {
            res.status(422).json(errors.errors[0].msg);
        }
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
};

// POST Signin with Google.
exports.google = async function (req, res, next) {
    try {
        const ticket = await gclient.verifyIdToken({
            idToken: req.body.idtoken
        });
        const payload = ticket.getPayload();
        const useremail = payload['email'];
        let user = await model.User.findOne({email: useremail});
        if (user) {
            req.login(user, error => {
                if (error) throw error;
            });
            res.status(200).json(await sessionData(user));
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        res.status(422).json("There was an error verifying your account. Please try again.");
    }
}

// GET logout.
exports.logout = function (req, res, next) {
    req.session.destroy( error => {
        if (error) res.status(422).end("An error occurred. Please try again.");
        res.status(200).end();
    });
}

// GET show profile.
exports.profile = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: req.params.username });
        let publications = await model.Publication.find({ user: user._id })
            .sort({date: "desc"})
            .limit(parseInt(process.env.LOAD_LIMIT))
            .populate({
                path: "user",
                select: "username img -_id"
            });
        if (user) {
            res.status(200).json({
                _id: user._id,
                username: user.username,
                name: user.name,
                img: user.img,
                ubication: user.ubication,
                description: user.description,
                following: {
                    amount: user.following.length,
                    status: user.following.includes(client.username)? true: false
                },
                followers: {
                    amount: user.followers.users.length,
                    status: user.followers.users.includes(client.username)? true: false
                },
                publications: publications
            });
        } else {
            res.status(422).json("User does not exists.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST edit profile.
exports.edit = async function (req, res, next) {
    try {
        let user = await model.User.findOne({ username: client.username });
        user.name = req.body.name;
        user.ubication = req.body.ubication;
        user.description = req.body.description;
        if (req.file !== undefined) {
            if (user.img !== "default_profile.png")
                fs.unlink("./public/images/profile/" + user.img, error => {
                    if (error) throw error;
                });
            user.img = req.file.filename;
        }
        await user.save();
        req.session.passport.user.img = user.img;
        res.status(200).json({img: user.img});
    } catch (error) {
        if (req.file) fs.unlink("./public/images/profile/" + req.file.filename, error => {});
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET search users
exports.search = async function (req, res, next) {
    try {
        let users = null;
        let skip = parseInt(req.query.break);
        switch (req.query.op) {
            case "following":
                users = await model.User.findOne({ username: req.query.id })
                    .select("following")
                    .populate({
                        path: "following",
                        select: "username img -_id",
                        options: {
                            limit: parseInt(process.env.LOAD_LIMIT),
                            skip: skip
                        }
                    })
                    .lean();
                users.following.map(i => i.follow = true);
                users = users.following;
                break;
            case "followers":
                users = await model.User.findOne({ username: req.query.id })
                    .select("following followers")
                    .populate({
                        path: "followers.users",
                        select: "username img",
                        options: {
                            limit: parseInt(process.env.LOAD_LIMIT),
                            skip: skip,
                            lean: true
                        }
                    });
                users.followers.users.map(i => i.follow = users.following.includes(i._id)? true: false);
                users = users.followers.users;
                break;
            default:
                let re = new RegExp(req.query.id, "i");
                let user = await model.User.findOne({ username: client.username }).select("following");
                users = await model.User
                    .find({username: re})
                    .sort({username: "asc"})
                    .select("username img")
                    .skip(skip)
                    .limit(parseInt(process.env.LOAD_LIMIT))
                    .lean();
                users.map(i => i.follow = user.following.includes(i._id)? true: false);
                break;
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// GET follow.
exports.follow = async function (req, res, next) {
    try {
        let userFing = await model.User.findOne({ username: client.username });
        let userFer = await model.User.findOne({ username: req.query.user });
        if (req.query.follow === "1") {
            if (!userFing.following.includes(userFer._id))
                userFing.following.unshift(userFer);
            if (!userFer.followers.users.includes(userFing._id)) {
                userFer.followers.users.unshift(userFing);
                userFer.followers.newest++;
            }
        } else {
            var i = userFing.following.indexOf(userFer._id);
            let j = userFer.followers.users.indexOf(userFing._id);
            if (i !== -1) userFing.following.splice(i, 1);
            if (j !== -1) userFer.followers.users.splice(j, 1);
        }
        await userFing.save();
        await userFer.save();
        res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST recovery request.
exports.recovery = async function (req, res, next) {
    try {
        let user = await model.User.findOneAndUpdate({ email: req.body.email });
        if (user) {
            await model.Token.findOneAndDelete({ email: req.body.email });
            let newToken = new model.Token({
                email: req.body.email
            });
            await newToken.save();
            let mailOptions = {
                from: nodemailerOptions.auth.user,
                to: user.email,
                subject: "WhatAWalk new password.",
                html: "<div style='text-align: center;'><h1>Hi " + user.username + ",</h1><p>We\'ve received a request to reset your password. If you didn\'t make the request, just ignore this email. Otherwise, you can use the link below to reset your password:</p><br><a href='" + process.env.WEB_URL + "/reset?email=" + newToken.email + "&token=" + newToken._id + "' style='padding: 10px; background: #5551f7; border-radius: 5px; color: #eaeaea;'>Click here to reset your password</a><br><br><p><i>This link is available 24 hours and can only be used once.</i></p><br><p>Thanks,<br>The <a href='" + process.env.WEB_URL + "' style='color: #5551f7;'>WhatAWalk</a> team.</p></div>"
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) throw error;
                // else console.log('Email sent: ' + info.response);
            });
            res.status(200).json("Ok");
        } else {
            res.status(422).json("Email does not exists.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// POST reset password.
exports.reset = async function (req, res, next) {
    try {
        let user = await model.User.findOneAndUpdate({ email: req.body.email });
        if (user) {
            let token = await model.Token.findOneAndDelete({ _id: req.body.token });
            if (token) {
                user.password = await bcrypt.hash(req.body.password, bcrypt.genSaltSync(10));
                await user.save();
                res.status(200).json("Ok");
            } else {
                res.status(422).json("Oops, an error occurred.");
            }
        } else {
            res.status(422).json("Oops, an error occurred.");
        }
    } catch (error) {
        res.status(422).json("Oops, an error occurred.");
    }
}

// GET delete account.
exports.deleteAccount = async function (req, res, next) {
    try {
        await model.Token.deleteMany({ email: client.email });
        await model.Notice.deleteMany({$or: [{ receiver: client._id }, { sender: client._id }]});
        let publications = await model.Publication.find({ user: client._id });
        await model.Publication.deleteMany({ user: client._id });
        for (let i = 0; i < publications.length; i++)
            if (publications[i].img)
                fs.unlink("./public/images/publication/" + publication[i].img, error => {
                    if (error) throw error;
                });

        await model.Group.updateMany({
                admins: {$nin: client._id},
                "members.user": {$in: client._id}
            }, {
                $pull: {members: {user: client._id}}
            });
        let isAdmin = await model.Group.find({admins: {$in: client._id}});
        for (let i = 0; i < isAdmin.length; i++) {
            if (isAdmin[i].members.length <= 1) {
                await isAdmin[i].delete();
                if (isAdmin[i].img !== "default_group.jpg")
                    fs.unlink("./public/images/group/" + isAdmin[i].img, error => {
                        if (error) throw error;
                    });
            } else {
                let memberIndex = isAdmin[i].members.map(i => i.user.toString()).indexOf(client._id);
                let adminIndex = isAdmin[i].admins.indexOf(client._id);
                if (adminIndex !== -1) isAdmin[i].members.splice(memberIndex, 1);
                if (adminIndex !== -1) isAdmin[i].admins.splice(adminIndex, 1);
                if (isAdmin[i].admins.length === 0) isAdmin[i].admins.push(isAdmin[i].members[0].user);
                await isAdmin[i].save();
            }
        }

        let user = await model.User.findOneAndDelete({ _id: client._id });
        await model.User.updateMany({_id: {$in: user.following}}, {$pull: {"followers.users": client._id}});
        await model.User.updateMany({_id: {$in: user.followers.users}}, {$pull: {following: client._id}});
        if (user.img !== "default_profile.png")
            fs.unlink("./public/images/profile/" + user.img, error => {
                if (error) throw error;
            });

        req.session.destroy( error => {
            if (error) res.status(422).end("An error occurred. Please try again.");
            res.status(200).end();
        });
    } catch (error) {
        res.status(422).json("Oops, an error occurred.");
    }
}

// Passport functions.
passport.serializeUser(function(user, done) {
    done(null, {_id: user._id, username: user.username, email: user.email, img: user.img});
});
   
passport.deserializeUser(function(user, done) {
    model.User.findById(user._id, function (error, user) {
        done(error, user.username);
    });
});

async function sessionData(user) {
    try {
        let notices = await model.Notice.find({receiver: user._id, seen: false});
        let groups = await model.Group.find({"members.user": {$in: user._id}}).select("members chat");
        let groupsNotify = [];
        groups.map(i => {
            let lastMsg = i.chat[i.chat.length - 1];
            let clientIndex = i.members.map(j => j.user.toString()).indexOf(user._id);
            let notify = lastMsg? i.members[clientIndex].accessed < lastMsg.date : false;
            groupsNotify.push({
                group: i._id,
                notify: notify
            });
        });
        return {
            username: user.username,
            img: user.img,
            notices: !!notices.length,
            groups: groupsNotify
        };
    } catch (error) {
        throw error;
    }
}
