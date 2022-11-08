const express = require("express");
const router = express.Router();

const { register, login, logout, verifyEmail, forgotPassword, resetPassword } = require("../controllers/authControllers");

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/email-verification').post(verifyEmail)
router.route('/forgot-password').post(forgotPassword)

router.route('/reset-password').post(resetPassword)
 
module.exports = router;
