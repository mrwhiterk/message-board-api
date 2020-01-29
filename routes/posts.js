const express = require('express')
const router = express.Router()
const passport = require('passport')
const postController = require('../controllers/post')

let auth = passport.authenticate('jwt-user')

router.get('/', postController.index)
router.post('/', auth, postController.create)
router.post('/like/:id', auth, postController.like)
router.post('/comments/:id', auth, postController.createComment)
router.delete('/comments/:postId/:id', auth, postController.deleteComment)
router.delete('/:id', auth, postController.deletePost)

module.exports = router
