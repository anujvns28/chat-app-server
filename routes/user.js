const express = require("express");
const router = express.Router();

const { 
    sendFraindRequest,
    acceptFraindRequest,
    getAllContact,
    blockUser,
    getUser,
    unBlockUser, 
    deleteUser,
    addUserInConatact,
    getAllUser
    } = require("../controller/user");


// send fraind requst
router.post("/sendRequest",sendFraindRequest)
// accept reques
router.post("/acceptRequest",acceptFraindRequest)
// fetch contact
router.post("/fetchContact",getAllContact)
// block conatac
router.post("/blockUser",blockUser)
// unblock conatac
router.post("/unBlockUser",unBlockUser)
// get userData
router.post("/getUser",getUser)
// delete user
router.post("/deleteUser",deleteUser);
// add userin contact
router.post("/addUserinContact",addUserInConatact);
// get all user
router.post("/getAllUsers",getAllUser);


module.exports = router