const Post = require('../models/Post')
const dbErrorMessage = require('../helpers/dbErrorMessage')
const formidable = require('formidable')

const { cloudinaryUpload, cloudinaryDestroy } = require('../helpers')

const index = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate('postedBy', '_id username')
      .populate('comments.postedBy', '_id username')
      .sort('-created')
      .exec()

    res.send(posts)
  } catch (err) {
    res.status(400).send(err)
  }
}

const createComment = async (req, res) => {
  let { id } = req.params
  let { text } = req.body

  try {
    let post = await Post.findById(id)

    let newComment = {
      text,
      postedBy: req.user._id
    }

    post.comments.push(newComment)
    let savedPost = await post.save()
    savedPost = await savedPost.populate('comments.postedBy').execPopulate()
    let lastMessage = savedPost.comments[savedPost.comments.length - 1]

    res.send(lastMessage)
  } catch (error) {
    res.send(error)
  }
}

const deleteComment = async (req, res) => {
  let { postId, id } = req.params

  try {
    let post = await Post.findById(postId)

    post.comments = post.comments.filter(item => {
      return item._id.toString() !== id.toString()
    })

    let savedPost = await post.save()

    res.send(savedPost)
  } catch (error) {
    res.status(400).send(error)
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
        postedBy: req.user._id
      })

      let savedPost = await post.save()

      let populatedNewPost = await savedPost
        .populate('postedBy', '_id username')
        .execPopulate()

      res.send(populatedNewPost)
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

const like = async (req, res) => {
  let { id } = req.params

  try {
    let post = await Post.findById(id)

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(
        item => item._id.toString() !== req.user._id.toString()
      )
    } else {
      post.likes.push(req.user._id)
    }

    let savedPost = await post.save()

    res.send(savedPost)
  } catch (error) {
    res.status(400).send(error)
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
      .sort('-created')
      .exec()

    res.status(200).send({ deletedPost, posts })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  index,
  create,
  deletePost,
  createComment,
  deleteComment,
  like
}
