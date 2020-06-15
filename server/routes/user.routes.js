// User Routes File.
const router = require("express").Router();
const path = require("path");
const uniquefilename = require("unique-filename");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/profile/");
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
    },
    // limits: {
    //     fileSize: 3840 * 2160 // 4K
    // }
});

const user = require("../controllers/user.controllers");
const validator = require("../middlewares/validators/user.validators");
const { isLoggedIn, hasAuth } = require("../middlewares/hasAuth.js");

router.use(isLoggedIn);


router.get("/session", user.session);
router.get("/exists", user.exists);
router.post("/signup", validator.signup, user.signup);
router.post("/login", validator.login, user.login);
router.post("/google", user.google);
router.get("/logout", user.logout);
router.get("/:username/profile", hasAuth, user.profile);
router.post("/:username/profile/edit", hasAuth, upload.single("img"), user.edit);
router.get("/search", hasAuth, user.search);
router.get("/follow", hasAuth, user.follow);
router.post("/recovery", user.recovery);
router.post("/reset", validator.reset, user.reset);
router.get("/deleteaccount", user.deleteAccount);


module.exports = router;
