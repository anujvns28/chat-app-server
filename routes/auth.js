const express = require("express");
const router = express.Router();

const { signup, sendOtp, login } = require("../controller/auth");




// signup
router.post("/signup",signup)
// geting otp
router.post("/getOtp",sendOtp)
// login user
router.post("/login",login)



module.exports = router