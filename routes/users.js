const express = require('express')
const router = express.Router()
const {
  signup,
  signin,
  getUsers,
  followUser,
  getUserFollowerAndFollowing,
  getUserProfileById,
  unfollowUser
} = require('../controllers/user')

const passport = require('passport')

router.get('/', passport.authenticate('jwt-user'), getUsers)
router.get(
  '/getUserProfileById/:id',
  passport.authenticate('jwt-user'),
  getUserProfileById
)
router.get(
  '/getUserFollowerAndFollowing',
  passport.authenticate('jwt-user'),
  getUserFollowerAndFollowing
)
router.post('/followUser', passport.authenticate('jwt-user'), followUser)
router.post('/unfollowUser', passport.authenticate('jwt-user'), unfollowUser)
router.post('/signup', signup)
router.post('/signin', signin)

module.exports = router
