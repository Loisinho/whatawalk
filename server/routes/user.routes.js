// App Routes File.
const router = require("express").Router();

const user = require("../controllers/user.controllers");
const validator = require("../middlewares/validators/user.validators");


// Public Routes:
router.get("/test", user.test);
router.get("/unique/username/:username", user.isUsernameUnique);
router.get("/unique/email/:email", user.isEmailUnique);
router.post("/signup", validator.signup, user.signup);
router.post("/login", validator.login, user.login);


module.exports = router;
