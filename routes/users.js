const express = require('express')
const router = express.Router()
const { signup, signin, getUsers, followUser } = require('../controllers/user')
const passport = require('passport')

router.get('/', passport.authenticate('jwt-user'), getUsers)
router.post('/followUser', passport.authenticate('jwt-user'), followUser)
router.post('/signup', signup)
router.post('/signin', signin)

module.exports = router
