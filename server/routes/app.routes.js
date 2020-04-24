// App Routes File.
const router = require("express").Router();

const app = require("../controllers/app.controllers");
const validateUser = require("../middlewares/validators/user.validators");


// Public Routes:
router.get("/test", app.test);
router.post("/signup", validateUser.signup, app.signup);


module.exports = router;
