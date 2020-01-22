const express = require('express')
const router = express.Router();
const passport = require('passport')
const postController = require('../controllers/post')

router.post('/', passport.authenticate('jwt-user'), postController.create)

module.exports = router;