const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
const User = require('../models/User')

module.exports = app => {
  const jwtOpts = {}
  jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
  jwtOpts.secretOrKey = process.env.USER_SECRET_KEY

  const userJWTLogin = new JwtStrategy(jwtOpts, async (payload, done) => {
    const { username } = payload

    try {
      if (username) {
        const user = await User.findOne({ username })

        return done(null, user || false)
      }
    } catch (err) {
      return done(null, false)
    }
  })

  app.use(passport.initialize())

  passport.serializeUser((user, cb) => {
    cb(null, user)
  })
  passport.deserializeUser((user, cb) => {
    cb(null, user)
  })
  passport.use('jwt-user', userJWTLogin)
}
