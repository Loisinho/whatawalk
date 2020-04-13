// Web Controllers File.

// GET test.
exports.test = function (req, res, next) {
    console.log("Hello World!");
    res.status(200).json("Hello World!");
};
