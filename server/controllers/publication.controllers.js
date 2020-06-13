// Publication Controllers File.
const model = require("../models");
const fs = require("fs");


// POST create publication.
exports.create = async function (req, res, next) {
    try {
        let img = req.file? req.file.filename : null;
        let newPublication = new model.Publication({
            user: client._id,
            text: req.body.text,
            img: img
        });
        newPublication = (await newPublication.save()).toObject();
        newPublication.user = {username: client.username, img: client.img};
        res.status(200).json(newPublication);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
};

// GET search publications.
exports.search = async function (req, res, next) {
    try {
        let publications = [];
        let skip = parseInt(req.query.break);
        switch (req.query.op) {
            case "own":
                publications = await model.Publication
                    .find({user: client._id})
                    .sort({date: "desc"})
                    .skip(skip)
                    .limit(parseInt(process.env.LOAD_LIMIT))
                    .populate({
                        path: "user",
                        select: "username img -_id"
                    });
                break;
            case "following":
                let user = await model.User.findOne({_id: client._id}).select("following -_id");
                publications = await model.Publication
                    .find({user: {$in: user.following}})
                    .sort({date: "desc"})
                    .skip(skip)
                    .limit(parseInt(process.env.LOAD_LIMIT))
                    .populate({
                        path: "user",
                        select: "username img -_id"
                    });
                break;
            default:
                let re = new RegExp(req.query.id, "i");
                publications = await model.Publication
                    .find({text: re})
                    .sort({text: "asc"})
                    .skip(skip)
                    .limit(parseInt(process.env.LOAD_LIMIT))
                    .populate({
                        path: "user",
                        select: "username img -_id"
                    });
                break;
        }
        res.status(200).json(publications);
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}

// DELETE delete publication.
exports.delete = async function(req, res, next) {
    try {
        await model.Publication.findOneAndDelete({_id: req.body.publication, user: client._id});
        res.status(200).json("Ok");
    } catch (error) {
        res.status(422).json("Oops, an error occurred. Please try again.");
    }
}
