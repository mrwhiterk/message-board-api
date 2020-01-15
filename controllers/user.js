const User = require('../models/User')
const dbErrorMessage = require('../helpers/dbErrorMessage')

// const bcrypt = require('bcryptjs')

module.exports = {
  signup: async (req, res) => {
    try {
      let user = await new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username
      })

      let createdUser = await user.save()

      res.json({
        message: 'Success',
        user: createdUser
      })
    } catch (err) {
      res.status(400).json({
        message: dbErrorMessage(err)
        // message: err
      })
    }
  }
}
