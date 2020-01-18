var express = require('express')
var router = express.Router()
let userController = require('../controllers/user')
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('jwt-user', { session: false }),
  userController.index
)

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

module.exports = router
