const express = require("express");
const router = express.Router();

const { createGroup, fetchGroup } = require("../controller/group");

// create group
router.post("/createGroup",createGroup);
// fetch group
router.post("/fetchGroup",fetchGroup);

module.exports = router