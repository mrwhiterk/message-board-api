const Post = require('../models/Post')
const dbErrorMessage = require('../helpers/dbErrorMessage')
const formidable = require('formidable')
const moment = require('moment')
const now = moment()
const { cloudinaryUpload, cloudinaryDestroy } = require('../helpers')

const index = async (req, res) => {
  try {
    let posts = await Post.find().populate('postedBy', '_id username')
    res.status(200).send(posts)
  } catch (err) {
    res.status(400).send(err)
  }
}

const create = async (req, res) => {
  try {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
      if (err) return res.send(err)

      let photoData = null

      if (files.photo) {
        photoData = await cloudinaryUpload(files.photo.path)
      }

      let post = new Post({
        text: fields.text,
        photo: photoData && photoData.secure_url,
        postedBy: req.user._id,
        created: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
      })

      await post.save()

      let populatedPost = await post
        .populate('postedBy', '_id username')
        .execPopulate()

      res.send(populatedPost)
    })
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({
        message: 'duplicate'
      })
    } else {
      res.status(400).send({
        message: error
      })
    }
  }
}

const deletePost = async (req, res) => {
  try {
    let deletedPost = await Post.findByIdAndDelete(req.params.id)
      .populate('postedBy', '_id username')
      .exec()

    if (deletedPost.photo) {
      await cloudinaryDestroy(deletedPost.photo)
    }

    let posts = await Post.find()
      .populate('postedBy', '_id username')
      .exec()

    res.status(200).send({ deletedPost, posts })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = { index, create, deletePost }
