const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email is required'
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: 'Username is required'
  },
  password: {
    type: String,
    required: 'Password is Required'
  },
  photo: {
    type: String,
    default: ''
  },
  created: {
    type: String,
    default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
  },
  following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
})

UserSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    let salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(user.password, salt)
  }
  next()
})

UserSchema.methods.generateAuthToken = async function() {
  const user = this

  let token = jwt.sign(
    {
      _id: user._id.toString(),
      username: user.username,
      created: user.created,
      email: user.email
    },
    process.env.USER_SECRET_KEY,
    {
      expiresIn: 3600
    }
  )

  return token
}

UserSchema.statics.comparePassword = async function(username, password) {
  const user = await User.findOne({ username })

  if (!user) {
    throw 'User not found, please sign up'
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw 'Check your email or password'
  }

  return user
}

const User = mongoose.model('User', UserSchema)

module.exports = User
