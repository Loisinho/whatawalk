// App Routes File.
const router = require("express").Router();

const app = require("../controllers/app.controllers");


// Public Routes:
router.get("/test", app.test);
router.post("/signup", app.signup);


module.exports = router;
