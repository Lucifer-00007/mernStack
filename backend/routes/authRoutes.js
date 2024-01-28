const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/signup')
    .post(loginLimiter, authController.signup)

router.route('/sendEmail')
    .post(loginLimiter, authController.sendEmail)

router.route('/sendEmailOtp')
    .post(loginLimiter, authController.sendEmailOtp)

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

module.exports = router