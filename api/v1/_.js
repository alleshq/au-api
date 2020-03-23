const express = require("express");
const auth = require("../../util/auth");

const router = express.Router();
router.get("/account", auth, require("./account"));
router.post("/account/secret", auth, require("./secret"));
router.get("/transactions", auth, require("./transactions"));
router.post("/transaction/:id", auth, require("./pay"));
router.get("/transaction/:id", auth, require("./transaction"));
router.delete("/transaction/:id", auth, require("./refund"));
module.exports = router;
