var express = require('express')
var router = express.Router()
let userController = require('../controllers/user')
const auth = require('../middleware/auth')
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('jwt-user', { session: false }),
  userController.index
)

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.post('/logout', auth, userController.logout)

router.post('/signin', userController.signin)

module.exports = router
