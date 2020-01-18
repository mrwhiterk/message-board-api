const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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

const User = mongoose.model('User', UserSchema)

module.exports = User
