const express = require("express");
const auth = require("../../util/auth");

const router = express.Router();
router.get("/account", auth, require("./account"));
module.exports = router;
