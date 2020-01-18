const express = require('express'),
  router = express.Router(),
  { signup, signin, index } = require('../controllers/user'),
  passport = require('passport')

router.get('/', passport.authenticate('jwt-user'), index)

router.post('/signup', signup)
router.post('/signin', signin)

module.exports = router
