const express = require("express");
const router = express.Router();

const {createChat ,fetchedChat} = require("../controller/chat")

// send msg
router.post("/sendMsz",createChat)
// fetched chats
router.post("/fetchedChat",fetchedChat)



module.exports = router