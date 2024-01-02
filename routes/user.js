const express = require("express");
const router = express.Router();

const { sendFraindRequest, acceptFraindRequest } = require("../controller/user");


// send fraind requst
router.post("/sendRequest",sendFraindRequest)
// accept reques
router.post("/acceptRequest",acceptFraindRequest)


module.exports = router