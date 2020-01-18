const { Strategy, ExtractJwt } = require('passport-jwt')
const passport = require('passport')
const { findUserFromToken } = require('../helpers')

module.exports = app => {
  app.use(passport.initialize())

  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.USER_SECRET_KEY
  }

  passport.serializeUser((user, cb) => {
    cb(null, user)
  })
  passport.deserializeUser((user, cb) => {
    cb(null, user)
  })
  passport.use('jwt-user', new Strategy(jwtOpts, findUserFromToken))
}
