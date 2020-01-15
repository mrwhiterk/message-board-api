const mongoose = require('mongoose')
const moment = require('moment')
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
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
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

  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)

  user.tokens = user.tokens.concat({
    token: token
  })

  await user.save()

  return token
}

UserSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username: username })

  if (!user) {
    throw new Error('wrong email or password')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('wrong email or password')
  }

  return user
}

const User = mongoose.model('User', UserSchema)

module.exports = User
