const express = require("express");
const router = express.Router();

const { 
    createGroup,
     fetchGroup, 
     fetchGroupInformation, 
     commonGroup 
    } = require("../controller/group");

// create group
router.post("/createGroup",createGroup);
// fetch group
router.post("/fetchGroup",fetchGroup);
// fetch groupinf
router.post("/fetchGroupInfo",fetchGroupInformation)
// fetch common group
router.post("/commonGroup",commonGroup)

module.exports = router