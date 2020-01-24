const User = require('../models/User')
const cloudinary = require('cloudinary').v2

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

const findUserFromToken = async ({ _id }, done) => {
  try {
    if (_id) {
      const user = await User.findById(_id)
      return done(null, user || false)
    }
  } catch (err) {
    return done(null, false)
  }
}

const cloudinaryUpload = async url => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  try {
    return await cloudinary.uploader.upload(url)
  } catch (error) {
    return error
  }
}

module.exports = {
  checkDuplicateEntry,
  findUserFromToken,
  cloudinaryUpload
}
