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
    getAllUser,
    changDp,
    changeUserAbout,
    changeUserName,
    fetchAllRequest,
    createStatus,
    fetchallStatus,
    deleteStatus,
    getSenderRequestData
    } = require("../controller/user");


// send fraind requst
router.post("/sendRequest",sendFraindRequest)
// accept reques
router.post("/acceptRequest",acceptFraindRequest)
// fetch send fraind requst data
router.post("/requestUserData",getSenderRequestData)
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
// change group img
router.post("/changeUserImage",changDp);
// change group name
router.post("/changeUserName",changeUserName);
// change group desc
router.post("/changeUserDesc",changeUserAbout);
// fetch user reqest
router.post("/fetchRequest",fetchAllRequest);
// add status
router.post("/addStatus",createStatus);
// fetch all status
router.post("/fetchAllStatus",fetchallStatus);
// delete status
router.post("/deleteStatus",deleteStatus);

module.exports = router