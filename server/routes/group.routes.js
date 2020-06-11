// Group Routes File.
const router = require("express").Router();

const group = require("../controllers/group.controllers");
const { isLoggedIn, hasAuth } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


router.get("/:group/find", hasAuth, group.find);
router.patch("/:group/admin", hasAuth, group.admin);
router.patch("/:group/remove", hasAuth, group.remove);
router.patch("/:group/msg", hasAuth, group.msg);
router.get("/:group/accessed", hasAuth, group.accessed);
router.post("/create", hasAuth, group.create);
router.get("/search", hasAuth, group.search);
router.get("/groupadmin", hasAuth, group.groupAdmin);
router.post("/invite", hasAuth, group.invite);
router.get("/join", hasAuth, group.join);
router.post("/travel", hasAuth, group.travel);


module.exports = router;
