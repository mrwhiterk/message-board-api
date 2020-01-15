var express = require('express');
var router = express.Router();
let userController = require('../controllers/user')

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', userController.signup)

module.exports = router;
