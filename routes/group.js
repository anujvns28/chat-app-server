const express = require("express");
const router = express.Router();

const { createGroup } = require("../controller/group");

// create group
router.post("/createGroup",createGroup)

module.exports = router