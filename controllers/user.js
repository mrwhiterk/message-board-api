const User = require('../models/User')
const dbErrorMessage = require('../helpers/dbErrorMessage')

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
  }
}

