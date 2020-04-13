// Web Routes File.
const express = require("express");
const router = express.Router();

const web = require("../controllers/web.controllers");


// Public Routes:
router.get("/test", web.test);


module.exports = router;
