const express = require("express");
const auth = require("../../util/auth");

const router = express.Router();
router.get("/account", auth, require("./account"));
router.post("/account/secret", auth, require("./secret"));
router.get("/transactions", auth, require("./transactions"));
router.get("/transaction/:id", auth, require("./transaction"));
module.exports = router;
