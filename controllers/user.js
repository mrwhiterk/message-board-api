const User = require('../models/User')
const dbErrorMessage = require('../helpers/dbErrorMessage')
// const authHelper = require('../helpers/auth')
const { checkDuplicateEntry } = require('../helpers')

const index = async (req, res) => res.send('respond with a resource')

// I need to find out why mongoose unique field check doesn't always work
const signup = async (req, res) => {
  try {
    let duplicateMessage = await checkDuplicateEntry(req, res)
    if (duplicateMessage) {
      return res.status(400).json({
        message: duplicateMessage
      })
    }

    let user = await new User(req.body)
    await user.save()

    res.send()
  } catch (err) {
    res.status(400).json({
      message: dbErrorMessage(err)
    })
  }
}

const signin = async ({ body: { username, password } }, res) => {
  try {
    const user = await User.comparePassword(username, password)
    const token = await user.generateAuthToken()

    res.send({
      token
    })
  } catch (err) {
    res.status(400).send({
      message: err
    })
  }
}

module.exports = {
  index,
  signup,
  signin
}
