const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')

const User = require('../models/User')

const keys = process.env.USER_SECRET_KEY

const jwtOpts = {}
jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOpts.secretOrKey = keys

const userJWTLogin = new JwtStrategy(jwtOpts, async (payload, done) => {
  const username = payload.username

  try {
    if (username) {
      const user = await User.findOne({ username })

      if (!user) {
        return done(null, false)
      } else {
        return done(null, user)
      }
    }
  } catch (err) {
    return done(null, false)
  }
})

module.exports = userJWTLogin
