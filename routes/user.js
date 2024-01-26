const express = require("express");
const router = express.Router();

const { 
    sendFraindRequest,
    acceptFraindRequest,
    getAllContact,
    blockUser,
    getUser,
    unBlockUser 
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


module.exports = router