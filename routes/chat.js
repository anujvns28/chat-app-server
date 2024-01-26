const express = require("express");
const router = express.Router();

const {
    createGroupChat,
    fetchGroupChat,
    createOneOneChat,
    fetchOneoneChat
} = require("../controller/chat")

//send one one msg
router.post("/sendOneOneMsz",createOneOneChat)
// send group msg
router.post("/sendGroupMsz",createGroupChat)
// fetched chats
router.post("/fetchGroupChat",fetchGroupChat)
// fetched one one chats
router.post("/fetchOneOneChats",fetchOneoneChat)



module.exports = router