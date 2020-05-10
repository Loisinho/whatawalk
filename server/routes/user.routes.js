// App Routes File.
const router = require("express").Router();

const user = require("../controllers/user.controllers");
const validator = require("../middlewares/validators/user.validators");
const { isLoggedIn, hasAuth } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


// Public Routes:
router.get("/session", user.session);
router.get("/unique/username/:username", user.isUsernameUnique);
router.get("/unique/email/:email", user.isEmailUnique);
router.post("/signup", validator.signup, user.signup);
router.post("/login", validator.login, user.login);
router.get("/logout", user.logout);
router.get("/profile/:username", user.profile);
router.get("/test", hasAuth, user.test);


module.exports = router;
