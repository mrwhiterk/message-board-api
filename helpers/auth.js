const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const comparePassword = async (incomingPassword, userPassword) => {
  try {
    let comparePassword = await bcrypt.compare(incomingPassword, userPassword)

    if (comparePassword) {
      return comparePassword
    } else {
      throw 409
    }
  } catch (err) {
    return err;
  }
}

const createJwtToken = async (user) => {

  let payload;

  payload = {
    id: user._id,
    email: user.email,
    username: user.username
  }

  let jwtToken = await jwt.sign(payload, process.env.USER_SECRET_KEY, {
    expiresIn: 3600
  })

  return jwtToken;
} 

module.exports = {
  comparePassword,
  createJwtToken
}