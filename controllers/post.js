const Post = require('../models/Post')
const dbErrorMessage = require('../helpers/dbErrorMessage')

const index = async (req, res) => {
  try {
    let posts = await Post.find()
    res.send(posts)
  } catch (err) {
    res.status(400).send()
  }
}

const create = async (req, res) => {
  try {
    let { text, photo } = req.body

    let post = new Post({
      text,
      photo,
      postedBy: req.user._id
    })

    await post.save()

    res.send(post)

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

module.exports = { index, create }
