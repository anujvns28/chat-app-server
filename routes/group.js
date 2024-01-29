const express = require("express");
const router = express.Router();

const { 
    createGroup,
     fetchGroup, 
     fetchGroupInformation, 
     commonGroup,
     exitUser,
     addGroupMember,
     makeGroupAdmin,
     dismissGroupAdmin
    } = require("../controller/group");

// create group
router.post("/createGroup",createGroup);
// fetch group
router.post("/fetchGroup",fetchGroup);
// fetch groupinf
router.post("/fetchGroupInfo",fetchGroupInformation)
// fetch common group
router.post("/commonGroup",commonGroup);
// exist user in group
router.post("/existGroup",exitUser);
// add user in group
router.post("/addUserInGroup",addGroupMember);
// make group admin
router.post("/makeroupAdmin",makeGroupAdmin);
// dismiss group admin
router.post("/dismissGroupAdmin",dismissGroupAdmin)

module.exports = router