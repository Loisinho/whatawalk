// App Routes File.
const router = require("express").Router();
const path = require("path");
const uniquefilename = require("unique-filename");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/profile/');
    },
    filename: function (req, file, cb) {
        cb(null, uniquefilename("") + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const user = require("../controllers/user.controllers");
const validator = require("../middlewares/validators/user.validators");
const { isLoggedIn, hasAuth } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


// Public Routes:
router.get("/session", user.session);
router.get("/:email/exists/email", user.emailExists);
router.get("/:username/exists/username", user.usernameExists);
router.post("/signup", validator.signup, user.signup);
router.post("/login", validator.login, user.login);
router.post("/google", user.google);
router.get("/logout", user.logout);
router.get("/:username/profile", user.profile);
router.post("/:username/profile/edit", hasAuth, upload.single('img'), user.edit);


module.exports = router;
