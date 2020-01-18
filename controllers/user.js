const User = require('../models/User')
const dbErrorMessage = require('../helpers/dbErrorMessage')
const authHelper = require('../helpers/auth')

const index = async (req, res) => res.send('respond with a resource')

const checkDuplicateEntry = async (req, res) => {
  try {
    let emailExist = await User.findOne({ email: req.body.email })

    if (emailExist) {
      return `email already exists`
    }
    let usernameExist = await User.findOne({ username: req.body.username })

    if (usernameExist) {
      return `username already exists`
    }

    return null
  } catch (error) {
    return 'something went wrong'
  }
}

const signup = async function(req, res) {
  try {
    // I need to find out why mongoose unique field check doesn't always work
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

const signin = async (req, res) => {
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
