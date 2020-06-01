// Notice Routes File.
const router = require("express").Router();

const notice = require("../controllers/notice.controllers");
const { isLoggedIn, hasAuth } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


router.get("/search", hasAuth, notice.search);
router.delete("/cancel", hasAuth, notice.cancel);


module.exports = router;
