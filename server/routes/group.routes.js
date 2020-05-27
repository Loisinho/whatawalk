// Group Routes File.
const router = require("express").Router();

const group = require("../controllers/group.controllers");
const { isLoggedIn, hasAuth, isAllowed } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


// Public Routes:
router.post("/create", hasAuth, group.create);
router.post("/invite", hasAuth, group.invite);
router.get("/search", hasAuth, group.search);
router.get("/join", hasAuth, group.join);


module.exports = router;
