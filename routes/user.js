const express = require("express");
const router = express.Router();

const { sendFraindRequest, acceptFraindRequest, getAllContact } = require("../controller/user");


// send fraind requst
router.post("/sendRequest",sendFraindRequest)
// accept reques
router.post("/acceptRequest",acceptFraindRequest)
// fetch contact
router.post("/fetchContact",getAllContact)


module.exports = router