var express = require('express');
var router = express.Router();
let userController = require('../controllers/user')
const auth = require('../middleware/auth')
// const jwt = require('jsonwebtoken')
// const User = require('../models/User')

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', userController.signup)

router.post('/login', userController.login)

router.post('/logout', auth, userController.logout)

module.exports = router;
