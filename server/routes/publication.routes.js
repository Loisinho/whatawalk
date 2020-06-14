// Publication Routes File.
const router = require("express").Router();
const path = require("path");
const uniquefilename = require("unique-filename");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/publication/");
    },
    filename: function (req, file, cb) {
        cb(null, uniquefilename("") + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg")
            return callback(new Error("This file extension is not allowed."))
        cb(null, true);
    }
});

const publication = require("../controllers/publication.controllers");
const { isLoggedIn, hasAuth } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


router.post("/create", hasAuth, upload.single("img"), publication.create);
router.get("/search", hasAuth, publication.search);
router.delete("/delete", hasAuth, publication.delete);


module.exports = router;
