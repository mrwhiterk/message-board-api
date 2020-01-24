const express = require('express')
const router = express.Router();
const passport = require('passport')
const postController = require('../controllers/post')

let auth = passport.authenticate('jwt-user')


router.get('/', postController.index)
router.post('/', auth, postController.create)
router.delete('/:id', auth, postController.deletePost)

module.exports = router;