const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let UserSchema = new mongoose.Schema(
  {
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
    }
  },
  {
    timestamps: true
  }
)

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
    { _id: user._id.toString() },
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
