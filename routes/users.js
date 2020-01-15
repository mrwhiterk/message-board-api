var express = require('express');
var router = express.Router();
let userController = require('../controllers/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', userController.signup)

router.post('/login', async (req, res) => {

  try {
    const user = await User.findByCredentials(req.body.username, req.body.password)
    console.log('user', user)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    res.status(400).send({ error: err})
  }
})

module.exports = router;
