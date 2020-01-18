const express = require('express')
const router = express.Router()
const { signup, signin, index} = require('../controllers/user')
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('jwt-user', { session: false }),
  index
)

router.post('/signup', signup)
router.post('/signin', signin)

module.exports = router
