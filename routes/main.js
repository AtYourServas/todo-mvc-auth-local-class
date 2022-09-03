const express = require('express')  // setting up express
const router = express.Router()  // setting up router functionality of express
const authController = require('../controllers/auth') // connnecting to controller for authentication
const homeController = require('../controllers/home') // connecting to controller for home
const { ensureAuth, ensureGuest } = require('../middleware/auth')  // authentication middleware but not actually used on this page

router.get('/', ensureGuest, homeController.getIndex)  // get index page
router.get('/home', ensureAuth, homeController.getHome)  // get home page
router.get('/login', authController.getLogin)  // get login page
router.post('/login', authController.postLogin)  // submit login request
router.get('/logout', authController.logout)  // get logout
router.get('/signup', authController.getSignup)  // get signup page
router.post('/signup', authController.postSignup)  //submit signup form

module.exports = router