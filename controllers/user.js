const User = require('../models/User')
const dbErrorMessage = require('../helpers/dbErrorMessage')
const authHelper = require('../helpers/auth')

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
      })
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.username,
        req.body.password
      )

      const token = await user.generateAuthToken()
      res.send({ user, token })
    } catch (err) {
      res.status(400).send({ error: err })
    }
  },

  logout: async (req, res) => {
    res.send('you logged out')
  },

  signin: async (req, res) => {
    try {
      let foundUser = await User.findOne({ username: req.body.username })

      if (!foundUser) {
        throw 'User not found, please sign up'
      }

      let comparePassword = await authHelper.comparePassword(
        req.body.password,
        foundUser.password
      )

      if (comparePassword === 409) {
        throw 'Check your email and password'
      } else {
        let jwtToken = await authHelper.createJwtToken(foundUser)

        res.send({
          token: jwtToken
        })
      }
    } catch (err) {
      res.status(400).json({
        error: err
      })
    }
  }
}
