// Travel Routes File.
const router = require("express").Router();

const travel = require("../controllers/travel.controllers");
const { isLoggedIn, hasAuth } = require('../middlewares/hasAuth.js');

router.use(isLoggedIn);


router.get("/location", hasAuth, travel.location);
router.get("/poiInlocation", hasAuth, travel.poiInLocation);
router.get("/poiInCoordinates", hasAuth, travel.poiInCoordinates);


module.exports = router;
