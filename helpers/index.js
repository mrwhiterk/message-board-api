const User = require('../models/User')

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

module.exports = {
  checkDuplicateEntry
}
