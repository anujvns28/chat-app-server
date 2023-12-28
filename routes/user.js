const express = require("express");
const router = express.Router();

const { signup, getUser, sendOtp, login } = require("../controller/auth");




// signup
router.post("/signup",signup)
// geting otp
router.post("/getOtp",sendOtp)
// login user
router.post("/login",login)

router.post("/getUser",getUser)


module.exports = router