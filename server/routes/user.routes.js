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
const { isLoggedIn, hasAuth, isAllowed } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


// Public Routes:
router.get("/session", user.session);
router.get("/exists", user.exists);
router.post("/signup", validator.signup, user.signup);
router.post("/login", validator.login, user.login);
router.post("/google", user.google);
router.get("/logout", user.logout);
router.get("/:username/profile", user.profile);
router.post("/:username/profile/edit", hasAuth, isAllowed, upload.single('img'), user.edit);
router.get("/search/users", hasAuth, user.searchUsers);
router.get("/:username/follow", hasAuth, isAllowed, user.follow);


module.exports = router;
